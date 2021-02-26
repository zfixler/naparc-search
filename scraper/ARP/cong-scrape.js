const fetch = require('node-fetch')


const url = 'http://arpchurch.org/wp-admin/admin-ajax.php?action=store_search&lat=41.20332&lng=-77.19452&max_results=100&search_radius=500'


fetch(url)
    .then(response => response.json())
    .then(data => console.log(data.length))
    .catch(error => console.log(error))




