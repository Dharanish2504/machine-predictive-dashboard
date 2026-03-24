import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from imblearn.over_sampling import SMOTE

# 1️⃣ Load dataset
data = pd.read_csv("predictive_maintenance_dataset.csv")

# 2️⃣ Drop unnecessary columns
data = data.drop(["date", "device"], axis=1)

# 3️⃣ Separate features and target
X = data.drop("failure", axis=1)
y = data["failure"]

# 4️⃣ Split dataset (VERY IMPORTANT: split before SMOTE)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 5️⃣ Apply SMOTE only on training data
sm = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = sm.fit_resample(X_train, y_train)

# 6️⃣ Create Random Forest model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=None,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42
)

# 7️⃣ Train model using resampled data
model.fit(X_train_resampled, y_train_resampled)

# 8️⃣ Predict on original test data
y_pred = model.predict(X_test)

# 9️⃣ Evaluate model
print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n")
print(classification_report(y_test, y_pred))