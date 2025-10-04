from ultralytics import YOLO

# Load your trained model
model = YOLO("best.pt")  # path to your downloaded weights

# Run prediction on an image
results = model.predict("C:/Users/levi/Documents/Datasets/Screw datasets/IMG_20251004_213213_226.jpg")  # replace with your image path

# Print results
for r in results:
    probs = r.probs  # classification probabilities
    print("Predicted class:", model.names[probs.top1])  # class name
    print("Confidence:", probs.top1conf.item())  # confidence score
