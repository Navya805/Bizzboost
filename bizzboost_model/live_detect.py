from ultralytics import YOLO
import cv2
import requests
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_f.pt")
model = YOLO(MODEL_PATH)

cap = cv2.VideoCapture(0)

detected_once = False   # Flag to exit after 1 detection

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame, stream=True)

    for r in results:
        for box in r.boxes:
            if detected_once:
                break

            x1, y1, x2, y2 = box.xyxy[0]
            cls = int(box.cls[0])
            label = model.names[cls].lower();

            # Draw bounding box
            cv2.rectangle(frame, (int(x1), int(y1)), (int(x2), int(y2)), (0,255,0), 2)
            cv2.putText(
                frame, label, 
                (int(x1), int(y1)-10),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0,255,0), 2
            )

            # POST to backend only ONCE
            try:
                response = requests.post(
                    "http://localhost:5000/detect",
                    json={"name": label}
                )
                print("Backend response:", response.json())
            except Exception as e:
                print("❌ Backend not reachable:", e)

            detected_once = True
            break

    cv2.imshow("BizzBoost Live Detection", frame)

    # If detected_once → close
    if detected_once:
        cv2.waitKey(10000)  # small delay so window doesn't close too fast
        break

    # Manual quit
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
print(" YOLO Live Detect Closed After One Detection")
