// Mock Data for Charging Stations
const chargingStations = [
    { id: 1, name: 'Downtown Charging Hub', address: '123 Main Street, City Center', phone: '(555) 001-0001', lat: 40.7128, lng: -74.0060, chargers: [ { id: 'DC1', name: 'DC Fast Charger 1', power: '350kW', status: 'available' }, { id: 'DC2', name: 'DC Fast Charger 2', power: '350kW', status: 'in-use' }, { id: 'AC1', name: 'AC Charger 1', power: '7kW', status: 'available' }, ], availability: { available: 1, inUse: 1, maintenance: 0, occupied: 1 }, pricePerKwh: 0.35, baseFee: 2.00, isFastCharge: true },
    { id: 2, name: 'Airport Station', address: '456 Airport Road', phone: '(555) 002-0002', lat: 40.7700, lng: -73.8700, chargers: [ { id: 'DC3', name: 'DC Fast Charger 3', power: '350kW', status: 'available' }, { id: 'AC2', name: 'AC Charger 2', power: '7kW', status: 'available' }, { id: 'AC3', name: 'AC Charger 3', power: '7kW', status: 'maintenance' }, ], availability: { available: 2, inUse: 0, maintenance: 1, occupied: 0 }, pricePerKwh: 0.40, baseFee: 2.50, isFastCharge: true },
    { id: 3, name: 'Shopping Mall Garage', address: '789 Market Avenue', phone: '(555) 003-0003', lat: 40.7500, lng: -73.9900, chargers: [ { id: 'AC4', name: 'AC Charger 4', power: '7kW', status: 'in-use' }, { id: 'AC5', name: 'AC Charger 5', power: '7kW', status: 'available' }, ], availability: { available: 1, inUse: 1, maintenance: 0, occupied: 0 }, pricePerKwh: 0.30, baseFee: 1.50, isFastCharge: false },
    { id: 4, name: 'University Campus West', address: '321 Campus Drive', phone: '(555) 004-0004', lat: 40.8100, lng: -74.0100, chargers: [ { id: 'AC6', name: 'AC Charger 6', power: '7kW', status: 'available' }, { id: 'AC7', name: 'AC Charger 7', power: '7kW', status: 'available' }, { id: 'AC8', name: 'AC Charger 8', power: '7kW', status: 'available' }, ], availability: { available: 3, inUse: 0, maintenance: 0, occupied: 0 }, pricePerKwh: 0.25, baseFee: 1.00, isFastCharge: false }
];

let map = null;
let markers = [];
let userLocation = { lat: 40.7128, lng: -74.0060 };
let selectedStation = null;
let currentBooking = null;

// Initialize Map or fallback placeholder
function initMap() {
    const mapElement = document.getElementById('map');
    if (typeof google === 'undefined' || !google || !google.maps) {
        mapElement.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
                <h2>📍 Map Not Available</h2>
                <p>Google Maps API key not configured yet.</p>
                <p style="font-size: 0.9rem; margin-top: 20px; max-width: 300px;">
                    You can still search, book, and pay for charging stations!<br><br>
                    Add the key in index.html once ready.
                </p>
            </div>
        `;
        displayStations();
        return;
    }

    map = new google.maps.Map(mapElement, {
        zoom: 13,
        center: userLocation,
        styles: getMapStyles()
    });

    new google.maps.Marker({
        position: userLocation,
        map,
        title: 'Your Location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    });

    displayStations();
}

function getMapStyles() {
    return [
        { featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#616161' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e9e9e9' }, { lightness: 17 }] }
    ];
}

function displayStations(stations = chargingStations) {
    if (map) {
        markers.forEach(marker => marker.setMap(null));
        markers = [];
    }

    const stationsList = document.getElementById('stationsList');
    stationsList.innerHTML = '';

    stations.forEach(station => {
        if (map) {
            const markerIcon = station.availability.available > 0
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';

            const marker = new google.maps.Marker({
                position: { lat: station.lat, lng: station.lng },
                map,
                title: station.name,
                icon: markerIcon
            });

            marker.addListener('click', () => selectStation(station));
            markers.push(marker);
        }

        const stationItem = document.createElement('div');
        stationItem.className = 'station-item';
        stationItem.innerHTML = `
            <h4>${station.name}</h4>
            <p>📍 ${getDistance(userLocation, { lat: station.lat, lng: station.lng })}</p>
            <p>Available: <strong>${station.availability.available}</strong></p>
            <span class="status-badge ${station.availability.available > 0 ? 'available' : 'occupied'}">${station.availability.available > 0 ? '✓ Available' : '✗ Not Available'}</span>
        `;

        stationItem.addEventListener('click', () => selectStation(station));
        stationsList.appendChild(stationItem);
    });
}

function selectStation(station) {
    selectedStation = station;
    document.getElementById('stationName').textContent = station.name;
    document.getElementById('stationAddress').textContent = station.address;
    document.getElementById('stationPhone').textContent = station.phone;
    document.getElementById('stationDistance').textContent = getDistance(userLocation, { lat: station.lat, lng: station.lng });

    document.getElementById('availableCount').textContent = station.availability.available;
    document.getElementById('inUseCount').textContent = station.availability.inUse;
    document.getElementById('maintenanceCount').textContent = station.availability.maintenance;
    document.getElementById('occupiedCount').textContent = station.availability.occupied;

    const chargersList = document.getElementById('chargersList');
    chargersList.innerHTML = '';

    const chargerSelect = document.getElementById('chargerSelect');
    chargerSelect.innerHTML = '<option value="">Choose charger</option>';

    station.chargers.forEach(charger => {
        const chargerDiv = document.createElement('div');
        chargerDiv.className = 'charger-item';
        chargerDiv.innerHTML = `<span class="charger-name">${charger.name}</span><span class="charger-power">${charger.power}</span><span class="status-badge ${charger.status}">${charger.status}</span>`;
        chargersList.appendChild(chargerDiv);

        if (charger.status === 'available') {
            const option = document.createElement('option');
            option.value = charger.id;
            option.textContent = `${charger.name} (${charger.power})`;
            chargerSelect.appendChild(option);
        }
    });

    document.getElementById('pricePerKwh').textContent = station.pricePerKwh.toFixed(2);
    document.getElementById('baseFee').textContent = station.baseFee.toFixed(2);

    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    document.getElementById('startTime').value = now.toISOString().slice(0, 16);

    document.getElementById('stationDetails').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'none';
    document.getElementById('bookingsSection').style.display = 'none';

    if (map) {
        map.setCenter({ lat: station.lat, lng: station.lng });
    }
}

function getDistance(loc1, loc2) {
    const R = 3959;
    const dLat = (loc2.lat - loc1.lat) * Math.PI / 180;
    const dLng = (loc2.lng - loc1.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(loc1.lat * Math.PI / 180) * Math.cos(loc2.lat * Math.PI / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1) + ' mi';
}

function calculateEstimatedCost() {
    if (!selectedStation) return;

    const duration = parseFloat(document.getElementById('duration').value) || 0;
    const chargerSelect = document.getElementById('chargerSelect');
    const chargerPowerText = chargerSelect.options[chargerSelect.selectedIndex]?.text || '';
    const powerMatch = chargerPowerText.match(/(\d+)kW/);
    const chargerKW = powerMatch ? parseInt(powerMatch[1]) : 7;

    const estimatedEnergy = (duration * chargerKW) / 1000;
    const chargingCost = estimatedEnergy * selectedStation.pricePerKwh;
    const totalCost = selectedStation.baseFee + chargingCost;

    document.getElementById('estimatedCost').textContent = totalCost.toFixed(2);
    return totalCost;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => toast.classList.remove('show'), 3000);
}

function renderQRCode(amount, bookingId) {
    const qrSection = document.getElementById('qrPaymentSection');
    const qrImage = document.getElementById('qrImage');
    const qrInstruction = document.getElementById('qrInstruction');

    const paymentUrl = encodeURIComponent(`PAYME://to=YOUR-WALLET-ID&amount=${amount.toFixed(2)}&ref=${bookingId}`);
    const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?data=${paymentUrl}&size=240x240`;

    qrImage.src = qrSrc;
    qrInstruction.textContent = `Scan to pay $${amount.toFixed(2)} to receiver (YOUR-WALLET-ID).`;

    qrSection.style.display = 'block';
}

function hideQRCode() {
    const qrSection = document.getElementById('qrPaymentSection');
    qrSection.style.display = 'none';
}

function saveBooking(booking) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
}

function displayBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = '';

    if (bookings.length === 0) {
        bookingsList.innerHTML = '<p style="text-align:center; color:#7f8c8d;">No bookings yet</p>';
    } else {
        bookings.forEach((booking, index) => {
            const card = document.createElement('div');
            card.className = 'booking-card';
            card.innerHTML = `
                <h4>${booking.stationName}</h4>
                <p><strong>Booking ID:</strong> ${booking.id}</p>
                <p><strong>Date:</strong> ${booking.bookingDate}</p>
                <p><strong>Duration:</strong> ${booking.duration} hours</p>
                <p><strong>Amount Paid:</strong> $${booking.totalAmount.toFixed(2)}</p>
                <p><strong>Status:</strong> <span class="status-badge confirmed">${booking.status}</span></p>
                <div class="booking-actions">
                    <button class="btn btn-secondary" onclick="cancelBooking(${index})">❌ Cancel</button>
                </div>
            `;
            bookingsList.appendChild(card);
        });
    }

    document.getElementById('stationDetails').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'none';
    document.getElementById('bookingsSection').style.display = 'block';
}

function cancelBooking(index) {
    if (!confirm('Cancel this booking?')) return;

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    displayBookings();
    showToast('Booking cancelled', 'success');
}

function clearPaymentForm() {
    document.getElementById('cardName').value = '';
    document.getElementById('cardNumber').value = '';
    document.getElementById('expiry').value = '';
    document.getElementById('cvv').value = '';
    document.getElementById('chargerSelect').value = '';
    document.getElementById('duration').value = '1';
    hideQRCode();
}

// Event Listeners
window.addEventListener('load', () => {
    initMap();
    document.getElementById('duration').addEventListener('change', calculateEstimatedCost);
    document.getElementById('chargerSelect').addEventListener('change', calculateEstimatedCost);

    document.getElementById('searchInput').addEventListener('input', (e) => applyFilters(getFilteredStations()));
    document.getElementById('availableFilter').addEventListener('change', () => applyFilters(getFilteredStations()));
    document.getElementById('fastChargeFilter').addEventListener('change', () => applyFilters(getFilteredStations()));

    document.getElementById('locateBtn').addEventListener('click', () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
                if (map) map.setCenter(userLocation);
                displayStations(getFilteredStations());
                showToast('Location updated', 'success');
            });
        } else {
            showToast('Geolocation not supported', 'error');
        }
    });

    document.getElementById('refreshBtn').addEventListener('click', () => {
        displayStations(getFilteredStations());
        showToast('Stations refreshed', 'success');
    });

    document.getElementById('bookBtn').addEventListener('click', () => {
        if (!selectedStation) return showToast('Please select a station', 'error');
        const charger = document.getElementById('chargerSelect').value;
        const startTime = document.getElementById('startTime').value;
        const duration = parseFloat(document.getElementById('duration').value);

        if (!charger) return showToast('Please select a charger', 'error');
        if (!startTime || !duration || duration <= 0) return showToast('Please enter valid booking details', 'error');

        const bookingCost = calculateEstimatedCost();

        currentBooking = {
            id: 'BK' + Date.now(),
            stationId: selectedStation.id,
            stationName: selectedStation.name,
            charger, startTime, duration,
            vehicleType: document.getElementById('vehicleType').value,
            pricePerKwh: selectedStation.pricePerKwh,
            baseFee: selectedStation.baseFee,
            totalAmount: bookingCost,
            status: 'Pending'
        };

        document.getElementById('stationDetails').style.display = 'none';
        document.getElementById('paymentSection').style.display = 'block';

        document.getElementById('paymentStation').textContent = currentBooking.stationName;
        document.getElementById('bookingId').textContent = currentBooking.id;
        document.getElementById('paymentDateTime').textContent = new Date(currentBooking.startTime).toLocaleString();
        document.getElementById('paymentDuration').textContent = currentBooking.duration;
        document.getElementById('paymentCharger').textContent = charger;

        const chargerPowerText = document.getElementById('chargerSelect').selectedOptions[0].text;
        const powerMatch = chargerPowerText.match(/(\d+)kW/);
        const chargerKW = powerMatch ? parseInt(powerMatch[1]) : 7;
        const energy = (currentBooking.duration * chargerKW) / 1000;
        const chargingCost = energy * currentBooking.pricePerKwh;

        document.getElementById('costBase').textContent = currentBooking.baseFee.toFixed(2);
        document.getElementById('costCharging').textContent = chargingCost.toFixed(2);
        document.getElementById('totalAmount').textContent = currentBooking.totalAmount.toFixed(2);

        renderQRCode(currentBooking.totalAmount, currentBooking.id);

        showToast('Scan QR to pay or continue with card.', 'info');
    });

    document.getElementById('payNowBtn').addEventListener('click', () => {
        const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (paymentMethod === 'card') {
            const cardName = document.getElementById('cardName').value;
            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g,'');
            const expiry = document.getElementById('expiry').value;
            const cvv = document.getElementById('cvv').value;
            if (!cardName || !cardNumber || !expiry || !cvv) return showToast('Complete card details', 'error');
            if (cardNumber.length !== 16) return showToast('Invalid card number', 'error');
        }

        if (currentBooking) {
            currentBooking.status = 'Confirmed';
            currentBooking.bookingDate = new Date().toLocaleString();
            saveBooking(currentBooking);

            document.getElementById('paymentSection').style.display = 'none';
            document.getElementById('confirmationSection').style.display = 'block';

            document.getElementById('confirmBookingId').textContent = currentBooking.id;
            document.getElementById('confirmStation').textContent = currentBooking.stationName;
            document.getElementById('confirmDateTime').textContent = new Date(currentBooking.startTime).toLocaleString();
            document.getElementById('confirmDuration').textContent = currentBooking.duration;
            document.getElementById('confirmAmount').textContent = currentBooking.totalAmount.toFixed(2);

            showToast('✅ Payment recorded and booking confirmed!', 'success');
            currentBooking = null;
        }
    });

    document.getElementById('viewBookingsBtn').addEventListener('click', displayBookings);
    document.getElementById('newSearchBtn').addEventListener('click', () => {
        document.getElementById('confirmationSection').style.display = 'none';
        clearPaymentForm();
        showToast('Ready for a new booking', 'success');
    });

    document.getElementById('closeDetailsBtn').addEventListener('click', () => document.getElementById('stationDetails').style.display = 'none');
    document.getElementById('closeBookingsBtn').addEventListener('click', () => document.getElementById('bookingsSection').style.display = 'none');

    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('cardDetails').style.display = e.target.value === 'card' ? 'block' : 'none';
        });
    });
});

function getFilteredStations() {
    let filtered = [...chargingStations];
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(station => station.name.toLowerCase().includes(searchTerm) || station.address.toLowerCase().includes(searchTerm));
    }
    if (document.getElementById('availableFilter').checked) {
        filtered = filtered.filter(station => station.availability.available > 0);
    }
    if (document.getElementById('fastChargeFilter').checked) {
        filtered = filtered.filter(station => station.isFastCharge);
    }
    return filtered;
}

function applyFilters(stations) {
    displayStations(stations);
}
