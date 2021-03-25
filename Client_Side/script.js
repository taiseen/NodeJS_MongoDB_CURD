 // for clearing all input fields...
 const clearData = () => {
    let inputs = document.getElementsByTagName('input');
    for (data of inputs) {
        data.value = ''
    }
}

// CURD ==> "Read" "GET" Operation ==> OK
const loadDataFromMongoDB = () => {
    // get data from MongoDB Server...
    fetch('/products')
        .then(res => res.json())
        .then(data => {
            showData(data);
            //console.log(data);
        });
};
loadDataFromMongoDB();

//===========================

const showData = data => {

    const tableBody = document.getElementById('resultTable');
    tableBody.innerHTML = null;
    // vvi
    // forEach use for accessing objects inside data[array]
    data.forEach((object, index) => {
        // destructuring...
        const { _id, name, price, quantity } = object;

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${name}</td>
                <td>${price}/=</td>
                <td>${quantity}</td>
                <td>
                    <button onclick="update('${_id}')" class="update">Update</button>
                </td>
                <td>
                    <button onclick="remove(event , '${_id}')" class="remove">Remove</button>
                </td>
            </tr> ` ;

        tableBody.innerHTML += row;
    })

}




// CURD ==> "Update" "GET" Operation ==> 
const update = (id) => {
    fetch(`/product/${id}`)
        .then(res => res.json())
        .then(data => {
            editableFormForUpdate(data);
            //console.log(data);
        })
};

const editableFormForUpdate = data => {
    const { _id, name, price, quantity } = data;
    console.log(name, price, quantity);

    const forUpdate = document.getElementById('forUpdate');
    forUpdate.innerHTML = `
        <p><small>Product ID : ${_id}</small></p>
        <input type="text" value="${name}" id="name">
        <input type="number" value="${price}" id="price">
        <input type="text" value="${quantity}" id="quantity">
        <button class="btn" class="btn" onclick="updateEditableItem('${_id}')">Update Product</button>
    `;
    //console.log('Editable ==> ', data);
}

const updateEditableItem = (id) => {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const quantity = document.getElementById('quantity').value;

    const product = { id, name, price, quantity };

    fetch(`/update/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(product),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(res => res.json())
        .then(result => {
            if (result) {
                loadDataFromMongoDB();
                document.
                    getElementById('forUpdate').
                    innerHTML = null;
            }
        });
    alert("Update Successfully");
};



// CURD ==> "Delete" "Delete" Operation ==> OK
const remove = (event, id) => {

    const grandParent = event.target.parentElement.parentNode;

    const OK = confirm("Are you sure you want to delete?");

    if (OK) {
        fetch(`/delete/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    grandParent.style.display = 'none';
                }
                console.log('Delete Successful!')
            });

        alert('Delete Successful!');
    } else {
        alert('Your Product is not deleted...');
    }

};
