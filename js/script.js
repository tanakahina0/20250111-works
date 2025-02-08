
document.addEventListener('DOMContentLoaded', () => {
  const prefectures = {
    北海道: { latitude: 43.06417, longitude: 141.34694 },
    青森県: { latitude: 40.82444, longitude: 140.74 },
    岩手県: { latitude: 39.70361, longitude: 141.1525 },
    宮城県: { latitude: 38.26889, longitude: 140.87194 },
    秋田県: { latitude: 39.71861, longitude: 140.1025 },
    山形県: { latitude: 38.24056, longitude: 140.36333 },
    福島県: { latitude: 37.75, longitude: 140.46778 },
    茨城県: { latitude: 36.34139, longitude: 140.44667 },
    栃木県: { latitude: 36.56583, longitude: 139.88361 },
    群馬県: { latitude: 36.39111, longitude: 139.06083 },
    埼玉県: { latitude: 35.85694, longitude: 139.64889 },
    千葉県: { latitude: 35.60472, longitude: 140.12333 },
    東京都: { latitude: 35.68944, longitude: 139.69167 },
    神奈川県: { latitude: 35.44778, longitude: 139.6425 },
    新潟県: { latitude: 37.90222, longitude: 139.02361 },
    富山県: { latitude: 36.69528, longitude: 137.21139 },
    石川県: { latitude: 36.59444, longitude: 136.62556 },
    福井県: { latitude: 36.06528, longitude: 136.22194 },
    山梨県: { latitude: 35.66389, longitude: 138.56833 },
    長野県: { latitude: 36.65139, longitude: 138.18111 },
    岐阜県: { latitude: 35.39111, longitude: 136.72222 },
    静岡県: { latitude: 34.97694, longitude: 138.38306 },
    愛知県: { latitude: 35.18028, longitude: 136.90667 },
    三重県: { latitude: 34.73028, longitude: 136.50861 },
    滋賀県: { latitude: 35.00444, longitude: 135.86833 },
    京都府: { latitude: 35.02139, longitude: 135.75556 },
    大阪府: { latitude: 34.68639, longitude: 135.52 },
    兵庫県: { latitude: 34.69139, longitude: 135.18306 },
    奈良県: { latitude: 34.68528, longitude: 135.83278 },
    和歌山県: { latitude: 34.22611, longitude: 135.1675 },
    鳥取県: { latitude: 35.50361, longitude: 134.23833 },
    島根県: { latitude: 35.47222, longitude: 133.05056 },
    岡山県: { latitude: 34.66167, longitude: 133.935 },
    広島県: { latitude: 34.39639, longitude: 132.45944 },
    山口県: { latitude: 34.18583, longitude: 131.47139 },
    徳島県: { latitude: 34.06583, longitude: 134.55944 },
    香川県: { latitude: 34.34028, longitude: 134.04333 },
    愛媛県: { latitude: 33.84167, longitude: 132.76611 },
    高知県: { latitude: 33.55972, longitude: 133.53111 },
    福岡県: { latitude: 33.60639, longitude: 130.41806 },
    佐賀県: { latitude: 33.24944, longitude: 130.29889 },
    長崎県: { latitude: 32.74472, longitude: 129.87361 },
    熊本県: { latitude: 32.78972, longitude: 130.74167 },
    大分県: { latitude: 33.23806, longitude: 131.6125 },
    宮崎県: { latitude: 31.91111, longitude: 131.42389 },
    鹿児島県: { latitude: 31.56028, longitude: 130.55806 },
    沖縄県: { latitude: 26.2125, longitude: 127.68111 }
  };

  const weather_icons = {
    0: '☀️', // 晴れ
    1: '🌤️', // 晴れときどき曇り
    2: '⛅',  // 曇り
    3: '☁️',  // 曇り
    45: '🌫️', // 霧
    48: '🌫️', // 霧
    51: '🌧️', // 小雨
    61: '🌧️', // 雨
    71: '❄️',  // 雪
    95: '⛈️'   // 雷雨
  };

  const display_weather = (data, location) => {
    const current_hour = new Date().getHours();
    const current_temp = data.hourly.temperature_2m[current_hour];
    const max_temp = data.daily.temperature_2m_max[0];
    const min_temp = data.daily.temperature_2m_min[0];
    
    document.getElementById('location-name').textContent = `${location}の天気`;
    document.getElementById('current-temp').textContent = `現在の気温: ${current_temp}℃`;
    document.getElementById('max-temp').textContent = `最高気温: ${max_temp}℃`;
    document.getElementById('min-temp').textContent = `最低気温: ${min_temp}℃`;
  };

  const display_weekly_weather = (daily_data) => {
    const weather_list = document.getElementById('weekly-weather');
    weather_list.innerHTML = '';

    daily_data.time.forEach((date, index) => {
      const max_temp = daily_data.temperature_2m_max[index];
      const min_temp = daily_data.temperature_2m_min[index];
      const weather_code = daily_data.weathercode[index];
      const weather_icon = weather_icons[weather_code] || '🌥️';
      
      const weather_item = document.createElement('div');
      weather_item.classList.add('weather-item');
      weather_item.innerHTML = `
        <p>${date}</p>
        <p class="weather_icons">${weather_icon}</p>
        <p>最高: ${max_temp}℃ / 最低: ${min_temp}℃</p>
      `;
      weather_list.appendChild(weather_item);
    });
  };

  const get_weather_data = async (location) => {
    const { latitude, longitude } = prefectures[location];
    const api_key = 'あなたのAPIキー';
    const api_url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&daily=temperature_2m_max,temperature_2m_min,weathercode&current_weather=true&timezone=Asia/Tokyo`;

    try {
      const response = await fetch(api_url);
      const data = await response.json();
      display_weather(data, location);
      display_weekly_weather(data.daily);
    } catch (error) {
      console.error('天気情報の取得に失敗しました', error);
    }
  };

  const prefectureSelect = document.getElementById('prefecture-select');
  prefectureSelect.addEventListener('change', () => {
    const selected_prefecture = prefectureSelect.value;
    get_weather_data(selected_prefecture);
  });

  get_weather_data('東京都');
});
