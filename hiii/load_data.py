import pandas as pd

# Load dataset
data = pd.read_csv("predictive_maintenance_dataset.csv")

# Show first 5 rows
print("First 5 rows of dataset:")
print(data.head())

# Show dataset information
print("\nDataset Info:")
print(data.info())

# Check how many failures
print("\nFailure Count:")
print(data["failure"].value_counts())