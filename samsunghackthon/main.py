import pandas as pd
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("machine_data.csv")

# ================== DATA ANALYSIS ==================

# Show all rows (use carefully if dataset is large)
pd.set_option('display.max_rows', None)

# Missing values
print("\n❓ Missing Values:")
print(df.isnull().sum())

# Statistical summary
print("\n📈 Statistical Summary:")
print(df.describe())

# Machine status count
print("\n⚙️ Machine Status Count:")
print(df['machine_status'].value_counts())

# High risk conditions
print("\n⚠️ High Temperature (>85):")
print(df[df['temperature'] > 85])

print("\n⚠️ High Vibration (>0.8):")
print(df[df['vibration'] > 0.8])

# Correlation
print("\n🔗 Correlation Matrix:")
print(df.corr(numeric_only=True))

# ================== VISUALIZATION ==================

plt.figure()
df['temperature'].plot(title="Temperature Trend")
plt.xlabel("Index")
plt.ylabel("Temperature")
plt.show()

plt.figure()
df['vibration'].plot(title="Vibration Trend")
plt.xlabel("Index")
plt.ylabel("Vibration")
plt.show()

plt.figure()
df['machine_status'].value_counts().plot(kind='bar', title="Failure vs Normal")
plt.xlabel("Status (0=Normal, 1=Failure)")
plt.ylabel("Count")
plt.show()

# ================== MACHINE LEARNING ==================

# Features & Target
X = df[['temperature', 'vibration', 'pressure', 'humidity', 'runtime_hours']]
y = df['machine_status']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Test model
predictions = model.predict(X_test)
print("\n✅ Model Accuracy:", accuracy_score(y_test, predictions))

# ================== PREDICTION ==================

sample = pd.DataFrame([[90, 0.9, 40, 50, 300]],
columns=['temperature', 'vibration', 'pressure', 'humidity', 'runtime_hours'])

result = model.predict(sample)

print("\n🔍 Prediction Result:")
if result[0] == 1:
    print("⚠️ ALERT: Machine may fail soon!")
else:
    print("✅ Machine is safe")