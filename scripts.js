document.getElementById('weatherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const city = document.getElementById('city').value;
    const apiKey = 'f458a708df95ee78be02eb6eb535560e'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const apiForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const unsplashApiKey = 'your_unsplash_access_key'; // Replace with your actual Unsplash API key
    const unsplashApiUrl = `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=${unsplashApiKey}&per_page=4`;

    // Fetch current weather data
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data.weather) {
                document.querySelector('#location span').textContent = `${data.name}, ${data.sys.country}`;
                document.querySelector('#temperature span').textContent = `Temperature: ${data.main.temp}°C`;
                document.querySelector('#description span').textContent = `Weather: ${data.weather[0].description}`;
                document.querySelector('#humidity span').textContent = `Humidity: ${data.main.humidity}%`;
                document.querySelector('#wind span').textContent = `Wind Speed: ${data.wind.speed} m/s`;

                // Display weather icon
                const iconCode = data.weather[0].icon;
                document.getElementById('icon').innerHTML = `<img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Weather icon">`;

                // Fetch and display additional images from Unsplash
                fetch(unsplashApiUrl)
                    .then(response => response.json())
                    .then(images => {
                        if (images.results && images.results.length > 0) {
                            const imagesContainer = document.getElementById('imagesContainer');
                            imagesContainer.innerHTML = ''; // Clear previous images

                            images.results.slice(0, 4).forEach(image => {
                                const imageUrl = image.urls.regular;
                                const imageAlt = image.alt_description || 'Weather related image';
                                const imageElement = document.createElement('div');
                                imageElement.classList.add('image');
                                imageElement.innerHTML = `
                                    <img src="${imageUrl}" alt="${imageAlt}">
                                    <p>${imageAlt}</p>
                                `;
                                imagesContainer.appendChild(imageElement);
                            });
                        } else {
                            console.error('No images found for the city.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching images from Unsplash:', error);
                    });

                document.getElementById('weatherResult').style.display = 'block';
            } else {
                alert('City not found. Please try again.');
                document.getElementById('weatherResult').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            alert('Failed to fetch weather data. Please try again later.');
        });

    // Fetch weather forecast data
    fetch(apiForecastUrl)
        .then(response => response.json())
        .then(data => {
            const dailyForecasts = [];
            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                dailyForecasts.push({
                    date: new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                    temp: forecast.main.temp
                });
            }

            // Prepare data for chart.js
            const dates = dailyForecasts.map(forecast => forecast.date);
            const temps = dailyForecasts.map(forecast => forecast.temp);

            const ctx = document.getElementById('weatherChart').getContext('2d');
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: 'Temperature (°C)',
                        data: temps,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 5,
                        pointRadius: 7,
                        backgroundColor: '#ffee00a8',
                        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointBorderColor: '#000',
                        pointHoverRadius: 10,
                        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)',
                        pointHoverBorderColor: '#000',
                        lineTension: 0.6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        titleFontSize: 18,
                        bodyFontSize: 18,
                        footerFontSize: 18,
                        xPadding: 14,
                        yPadding: 14,
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: false,
                                fontColor: 'black',
                                fontSize: 20,
                                fontStyle: 'bold',
                            },
                            gridLines: {
                                color: '#fff',
                                lineWidth: 1,
                            }
                        }],
                        xAxes: [{
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 7,
                                fontColor: 'black',
                                fontSize: 20,
                                fontStyle: 'bold',
                            },
                            gridLines: {
                                color: '#fff',
                                lineWidth: 1,
                            }
                        }]
                    },
                }
            });
        })
        .catch(error => {
            console.error('Error fetching the weather forecast data:', error);
        });
});







