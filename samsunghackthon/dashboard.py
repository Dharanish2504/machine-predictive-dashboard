import pandas as pd
import matplotlib.pyplot as plt
import streamlit as st
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import plotly.express as px
import plotly.graph_objects as go

# Set page configuration
st.set_page_config(page_title="Machine Predictive Dashboard", layout="wide")

# Title and header
st.title("⚙️ Machine Predictive Maintenance Dashboard")
st.markdown("---")

# Load dataset
@st.cache_data
def load_data():
    return pd.read_csv("machine_data.csv")

df = load_data()

# Sidebar filters
st.sidebar.title("📊 Dashboard Controls")
st.sidebar.markdown("---")

# Show data overview
with st.sidebar:
    st.header("Dataset Info")
    st.metric("Total Records", len(df))
    st.metric("Total Columns", len(df.columns))

# ================== DATA ANALYSIS SECTION ==================
st.header("📈 Data Analysis")
col1, col2, col3, col4 = st.columns(4)

# Key metrics
with col1:
    st.metric("Avg Temperature", f"{df['temperature'].mean():.2f}°C")
with col2:
    st.metric("Avg Vibration", f"{df['vibration'].mean():.4f}")
with col3:
    st.metric("Avg Pressure", f"{df['pressure'].mean():.2f}")
with col4:
    st.metric("Avg Runtime Hours", f"{df['runtime_hours'].mean():.2f}h")

st.markdown("---")

# Missing values
st.subheader("❓ Missing Values")
missing = df.isnull().sum()
if missing.sum() == 0:
    st.success("✅ No missing values found!")
else:
    st.warning("⚠️ Missing values detected:")
    st.write(missing[missing > 0])

st.markdown("---")

# Statistical summary
st.subheader("📊 Statistical Summary")
st.dataframe(df.describe(), use_container_width=True)

st.markdown("---")

# Machine status count
st.subheader("⚙️ Machine Status Distribution")
status_counts = df['machine_status'].value_counts()
fig = px.pie(
    values=status_counts.values,
    names=['Normal' if x == 0 else 'Failure' for x in status_counts.index],
    title="Machine Status Distribution",
    color_discrete_map={'Normal': '#00CC96', 'Failure': '#EF553B'}
)
st.plotly_chart(fig, use_container_width=True)

st.markdown("---")

# ================== HIGH RISK CONDITIONS ==================
st.header("⚠️ High Risk Conditions")

col1, col2 = st.columns(2)

with col1:
    st.subheader("🌡️ High Temperature (>85°C)")
    high_temp = df[df['temperature'] > 85]
    st.metric("Records", len(high_temp))
    if len(high_temp) > 0:
        st.dataframe(high_temp, use_container_width=True)
    else:
        st.info("✅ No high temperature records found")

with col2:
    st.subheader("📳 High Vibration (>0.8)")
    high_vib = df[df['vibration'] > 0.8]
    st.metric("Records", len(high_vib))
    if len(high_vib) > 0:
        st.dataframe(high_vib, use_container_width=True)
    else:
        st.info("✅ No high vibration records found")

st.markdown("---")

# ================== VISUALIZATIONS ==================
st.header("📉 Trend Analysis")

col1, col2 = st.columns(2)

with col1:
    st.subheader("Temperature Trend")
    fig_temp = px.line(
        x=df.index,
        y=df['temperature'],
        labels={'x': 'Index', 'y': 'Temperature (°C)'},
        title='Temperature Over Time'
    )
    fig_temp.add_hline(y=85, line_dash="dash", line_color="red", annotation_text="Risk Level")
    st.plotly_chart(fig_temp, use_container_width=True)

with col2:
    st.subheader("Vibration Trend")
    fig_vib = px.line(
        x=df.index,
        y=df['vibration'],
        labels={'x': 'Index', 'y': 'Vibration'},
        title='Vibration Over Time'
    )
    fig_vib.add_hline(y=0.8, line_dash="dash", line_color="orange", annotation_text="Risk Level")
    st.plotly_chart(fig_vib, use_container_width=True)

st.markdown("---")

# Pressure and Humidity
col1, col2 = st.columns(2)

with col1:
    st.subheader("Pressure Trend")
    fig_press = px.line(
        x=df.index,
        y=df['pressure'],
        labels={'x': 'Index', 'y': 'Pressure'},
        title='Pressure Over Time'
    )
    st.plotly_chart(fig_press, use_container_width=True)

with col2:
    st.subheader("Humidity Trend")
    fig_humid = px.line(
        x=df.index,
        y=df['humidity'],
        labels={'x': 'Index', 'y': 'Humidity (%)'},
        title='Humidity Over Time'
    )
    st.plotly_chart(fig_humid, use_container_width=True)

st.markdown("---")

# Correlation heatmap
st.subheader("🔗 Correlation Matrix")
corr_matrix = df.corr(numeric_only=True)
fig_corr = px.imshow(
    corr_matrix,
    title="Feature Correlation",
    color_continuous_scale="RdBu",
    zmin=-1,
    zmax=1
)
st.plotly_chart(fig_corr, use_container_width=True)

st.markdown("---")

# ================== MACHINE LEARNING ==================
st.header("🤖 Machine Learning Model")

# Train model
@st.cache_resource
def train_model():
    X = df[['temperature', 'vibration', 'pressure', 'humidity', 'runtime_hours']]
    y = df['machine_status']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    
    return model, X_test, y_test, predictions

model, X_test, y_test, predictions = train_model()

# Model metrics
col1, col2, col3, col4 = st.columns(4)

accuracy = accuracy_score(y_test, predictions)
precision = precision_score(y_test, predictions)
recall = recall_score(y_test, predictions)
f1 = f1_score(y_test, predictions)

with col1:
    st.metric("Accuracy", f"{accuracy:.2%}")
with col2:
    st.metric("Precision", f"{precision:.2%}")
with col3:
    st.metric("Recall", f"{recall:.2%}")
with col4:
    st.metric("F1-Score", f"{f1:.2%}")

st.markdown("---")

# Feature importance
st.subheader("📊 Feature Importance")
feature_importance = pd.DataFrame({
    'Feature': ['temperature', 'vibration', 'pressure', 'humidity', 'runtime_hours'],
    'Importance': model.feature_importances_
}).sort_values('Importance', ascending=True)

fig_importance = px.bar(
    feature_importance,
    x='Importance',
    y='Feature',
    title='Feature Importance in Model',
    labels={'Importance': 'Importance Score'}
)
st.plotly_chart(fig_importance, width='stretch') 

st.markdown("---")

# ================== PREDICTION ==================
st.header("🔍 Real-time Prediction")

st.subheader("Enter Machine Parameters:")
col1, col2, col3, col4, col5 = st.columns(5)

with col1:
    temp = st.number_input("Temperature (°C)", value=90, min_value=0, max_value=150)
with col2:
    vib = st.number_input("Vibration", value=0.9, min_value=0.0, max_value=2.0, step=0.1)
with col3:
    press = st.number_input("Pressure", value=40, min_value=0, max_value=100)
with col4:
    humid = st.number_input("Humidity (%)", value=50, min_value=0, max_value=100)
with col5:
    runtime = st.number_input("Runtime Hours", value=300, min_value=0, max_value=10000)

# Make prediction
sample = pd.DataFrame([[temp, vib, press, humid, runtime]],
    columns=['temperature', 'vibration', 'pressure', 'humidity', 'runtime_hours'])

result = model.predict(sample)[0]

# Display prediction
st.markdown("---")
st.subheader("Prediction Result:")

# Check for threshold violations
threshold_exceeded = False
alert_messages = []

if temp > 85:
    threshold_exceeded = True
    alert_messages.append(f"🌡️ Temperature: {temp}°C (Threshold: >85°C)")
if vib > 0.8:
    threshold_exceeded = True
    alert_messages.append(f"📳 Vibration: {vib} (Threshold: >0.8)")
if press > 70:
    threshold_exceeded = True
    alert_messages.append(f"🔧 Pressure: {press} (Threshold: >70)")
if humid > 80:
    threshold_exceeded = True
    alert_messages.append(f"💧 Humidity: {humid}% (Threshold: >80%)")
if runtime > 8000:
    threshold_exceeded = True
    alert_messages.append(f"⏱️ Runtime Hours: {runtime}h (Threshold: >8000h)")

# Show alerts if thresholds are exceeded or model predicts failure
if result == 1 or threshold_exceeded:
    st.error("🚨 ALERT: Machine may fail soon!")
    st.warning("⚠️ Recommended Action: Schedule maintenance immediately")
    
    if threshold_exceeded:
        st.subheader("⚠️ Parameters Exceeding Safe Thresholds:")
        for msg in alert_messages:
            st.warning(msg)
else:
    st.success("✅ Machine is operating normally")
    st.info("ℹ️ Continue regular monitoring")

# Prediction probability
prob = model.predict_proba(sample)
st.metric("Failure Probability", f"{prob[0][1]:.2%}")

st.markdown("---")
st.text("Dashboard created with Streamlit • Data-driven Predictive Maintenance")
