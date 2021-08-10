window.onload = () => {
    const BASE_URL = "https://knot-opb.herokuapp.com";


    let form = document.getElementById('form');
    let form_otp = document.getElementById('form-otp');

    let token;

    form.addEventListener('submit', e => {
        e.preventDefault();
        let number = form.name.value;
        let pin = form.pin.value;
        let formData = new FormData();

        formData.append('number', number)
        formData.append('pin', pin)

        getToken(formData).then(response => {
            console.log(response.data.token);


            form_otp.addEventListener('submit', e => {
                e.preventDefault();
                let otp = form_otp.otp.value;
                let formData2 = new FormData();

                console.log(otp)

                formData2.append('otp', otp)

                getTransactions(response.data.token, formData2).then(response => {
                    displayTransactions(response.data)
                });
            });


        })

    });






    function getToken(data) {
        return axios.post(`${BASE_URL}/fidelity`, data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            .then(response => response)
            .catch(error => error);
    }




    function getTransactions(token, data) {
        return axios.post(`${BASE_URL}/verifyOTP/${token}`, data,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(response => response)
            .catch(error => error.toJSON());
    }

    function displayTransactions(resData) {
        let elem1 = `<h3>Account: <span>${resData.account}</span></h3>`;
        let elem2 = `<h3>Name: <span>${resData.name}</span></h3>`;
        let elem3 = `<h3>Account No: <span>${resData.account_number}</span></h3>`;
        let elem4 = `<h3>Balance: <span>GHS ${resData.balance}</span></h3>`;
        let elem5 = `<h3>Eligible loan amount: <span>GHS ${resData.eligible_loan_amount}</span></h3>`;
        $("#account-info").append(elem1, elem2, elem3, elem4, elem5);


        resData.transactions.map((transaction, i) => {
            let data_row = `<tr>
                                <td>${transaction.Balance}</td>
                                <td>${transaction.Credit}</td>
                                <td>${transaction.Debit}</td>
                                <td>${transaction.Date}</td>
                                <td>${transaction.Description}</td>
                            </tr>`
            $("#table-body").append(data_row);
        })
    }
}