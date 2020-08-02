$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'https://api-delta-seven.vercel.app';
const currentUser = localStorage.getItem('user');


if (currentUser) {
    $.get(`${API_URL}/users/${currentUser}/devices`)
    .then(response => {
      response.forEach((device) => {
        $('#devices tbody').append(`
          <tr data-device-id=${device._id}>
            <td>${device.user}</td>
            <td>${device.name}</td>
          </tr>`
        );
      });
      $('#devices tbody tr').on('click', (e) => {
        const deviceId = e.currentTarget.getAttribute('data-device-id');
        $.get(`${API_URL}/devices/${deviceId}/device-history`)
        .then(response => {
          response.map(sensorData => {
            $('#historyContent').append(`
              <tr>
                <td>${sensorData.ts}</td>
                <td>${sensorData.temp}</td>
                <td>${sensorData.loc.lat}</td>
                <td>${sensorData.loc.lon}</td>
              </tr>
            `);
          });
          $('#historyModal').modal('show');
        });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
  } else {
    const path = window.location.pathname;
    if (path !== '/login'&& path !=='/registration') {
      location.href = '/login';
    }
  }
   
//const devices = JSON.parse(localStorage.getItem('devices')) || [];
//const response = $.get('http://localhost:3001/devices');
//console.log(response);

/*
devices.forEach(function(device) {
$('#devices tbody').append(`
<tr>
<td>${device.user}</td>
<td>${device.name}</td>
</tr>`
);
});
*/
$.get(`${API_URL}/devices`)
.then(response => {
 response.forEach(device => {
 $('#devices tbody').append(`
 <tr>
 <td>${device.user}</td>
 <td>${device.name}</td>
 </tr>`
 );
 });
})
.catch(error => {
 console.error(`Error: ${error}`);
});
/*
const response = $.get('http://localhost:3001/devices');
console.log(response);
*/
$('#add-device').on('click', () => {
    const name = $('#name').val();
    const user = $('#user').val();
    const sensorData = [];
    const body = {
    name,
    user,
    sensorData
    };

    $.post(`${API_URL}/devices`, body)
    .then(response => {
    location.href = '/';
    })
    .catch(error => {
    console.error(`Error: ${error}`);
    });
   })
$('#send-command').on('click', function() {
const command = $('#command').val();
console.log(`command is: ${command}`);
});

//Kevin replaced
$('#register').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    const confirm = $('#confirm').val();
    if (password !== confirm) {
      $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
    } else {
      $.post(`${API_URL}/register`, { user, password })
      .then((response) =>{
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
    }
  });



/*$('#login').on('click',function(){
    const username = $('#username').val();
    const password = $('#password').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exist = users.find(user => user.username === username);
    const exists = users.find(user => user.password === password);
    if(exist == undefined )
    {
        $("#message").text("User doesn't exist");
    }
    else
    {
        if(exists == undefined)
        {
            $("#message").text("Password does not match.");
        }
        else
        {
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
            location.href = '/'
        }
    }
});*/
$('#login').on('click', () => {
    const user = $('#user').val();
    const password = $('#password').val();
    $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) =>{
    if (response.success) {
    localStorage.setItem('user', user);
    localStorage.setItem('isAdmin', response.isAdmin);
    location.href = '/';
    } else {
    $('#message').append(`<p class="alert alert-danger">${response}
   </p>`);
    }
    });
   });
const logout = () => {
localStorage.removeItem('user');
location.href = '/login';
}
