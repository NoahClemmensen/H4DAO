$(document).ready(function(){
    // alert(1);

    $('#deliveryModal').on('submit', function(e) {
        e.preventDefault();
        var data = $("#deliveryModal :input").serializeArray();
        console.log(data);
        // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/createDelivery',
            data: {
                shopId: data[0].value,
                senderId: data[1].value
            },
            success: function(data) {
                console.log(data);
                location.reload();
            }
        });
    });

    $('#deleteDelivery').on('click', function(e) {
        console.log('delete');
       // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/cancelDelivery/' + $(this).data('id'),
            success: function(data) {
                console.log(data);
                location.reload();
            }
        })
    });

    $('#shopModal').on('submit', function(e) {
        e.preventDefault();
        var data = $("#shopModal :input").serializeArray();
        console.log(data);
        // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/createShop',
            data: {
                name: data[0].value,
                address: data[1].value,
                zip: data[2].value,
                phone: data[3].value,
                email: data[4].value,
                lat: data[5].value,
                lng: data[6].value
            },
            success: function(data) {
                console.log(data);
                location.reload();
            }
        });
    });

    $('#deleteShop').on('click', function(e) {
        console.log('delete');
       // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/deleteShop/' + $(this).data('id'),
            success: function(data) {
                console.log(data);
                location.reload();
            }
        })
    });

    $('#senderModal').on('submit', function(e) {
        e.preventDefault();
        var data = $("#senderModal :input").serializeArray();
        console.log(data);
        // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/createSender',
            data: {
                name: data[0].value,
                address: data[1].value,
                zip: data[2].value,
                phone: data[3].value,
                email: data[4].value
            },
            success: function(data) {
                console.log(data);
                location.reload();
            }
        });
    });

    $('#deleteSender').on('click', function(e) {
        console.log('delete');
       // Ajax the API
        $.ajax({
            type: 'POST',
            url: '/deleteSender/' + $(this).data('id'),
            success: function(data) {
                console.log(data);
                location.reload();
            }
        })
    });
})