function formatTime(time24) {   //format 24 hour time as 12 hour time
    if (!time24) return;
    // Parse the input time string
    const [hours, minutes] = time24.split(':').map(Number);

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert hours to 12-hour format
    const hours12 = hours % 12 || 12; // 0 should be 12 in 12-hour format

    // Format the time string
    const time12 = `${hours12}:${String(minutes).padStart(2, '0')} ${period}`;

    return time12;
}

function formatDateAsDDMMYYYY(date) { //format input date as DD-MM-YYYY
    if (!date) return;
    date = date?.split('T')[0] ? date.split('T')[0] : date;
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
}

function formatDateAsYYYYMMDD(date) { //format input date as YYYY-MM-DD
    if (!date) return;
    const [year, month, day] = date.split('-');
    return `${year}-${month}-${day}`;
}

function formatDateAsDDMMYYYYHHMMSS(date) { //format input date as DD-MM-YYYY HH:MM:SS
    if (!date) return;
    let time = date?.split('T')[1];
    time = formatTime(time);
    date = date?.split('T')[0] ? date.split('T')[0] : date;
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year} ${time}`;
}

function truncateName(name, maxLength) {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
};

function calculateTimeDifferenceinHours(startTime, endTime) {
    if (startTime.toString().includes('T') && endTime.toString().includes("T")) { //if datetime as input params then modify as time
        startTime = startTime.split('T')[1].replace("Z", '');
        endTime = endTime.split("T")[1].replace("Z", '');
    }
    const [startHours, startMinutes, StartSeconds] = startTime.split(":").map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(":").map(Number);
    const startDate = new Date();
    const endDate = new Date();
    startDate.setHours(startHours, startMinutes, StartSeconds, 0);
    endDate.setHours(endHours, endMinutes, endSeconds, 0);
    let timeDiffMilliseconds = endDate.getTime() - startDate.getTime();

    // If the difference is negative, it means the end time is on the next day
    if (timeDiffMilliseconds < 0) {
        timeDiffMilliseconds += 24 * 60 * 60 * 1000; // Add 24 hours in milliseconds
    }
    const timeDiffHours = timeDiffMilliseconds / (1000 * 60 * 60);
    return timeDiffHours;
}

// here set the userLocation -------------------------------------------------------
function getUserGeoLocation() {
    console.log("getUserGeoLocation");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                return { success: 1, latitude, longitude };
            }, (error) => {
                console.log("error", error);
                let response;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.error('User denied the request for Geolocation.');
                        response = { success: 0, error: 'Location access denied. Please enable location services to use this feature.' }
                        // alert('Location access denied. Please enable location services to use this feature.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.error('Location information is unavailable.');
                        response = { success: 0, error: 'Location information is currently unavailable. Please try again later.' }
                        // alert('Location information is currently unavailable. Please try again later.');
                        break;
                    case error.TIMEOUT:
                        console.error('The request to get user location timed out.');
                        response = { success: 0, error: 'Request to access location timed out. Please try again.' }
                        // alert('Request to access location timed out. Please try again.');
                        break;
                    default:
                        console.error('An unknown error occurred.');
                        response = { success: 0, error: 'An unknown error occurred while accessing your location.' }
                        // alert('An unknown error occurred while accessing your location.');
                }
                return response;
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser");
        return { success: 0, error: 'Geolocation is not supported by this browser' }
    }
    return;
}

export { formatTime, formatDateAsDDMMYYYY, formatDateAsYYYYMMDD, formatDateAsDDMMYYYYHHMMSS, getUserGeoLocation, truncateName, calculateTimeDifferenceinHours }