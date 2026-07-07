document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const calculateBtn = document.getElementById('calculateBtn');
    const newCalculationBtn = document.getElementById('newCalculationBtn');
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('error');
    const num1Value = document.getElementById('num1Value');
    const num2Value = document.getElementById('num2Value');
    const resultValue = document.getElementById('resultValue');

    // Event listeners
    calculateBtn.addEventListener('click', calculateMultiplication);
    newCalculationBtn.addEventListener('click', resetForm);

    // Allow Enter key to calculate
    num1Input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateMultiplication();
        }
    });

    num2Input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            calculateMultiplication();
        }
    });

    function calculateMultiplication() {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);

        // Clear previous errors
        hideError();

        // Validation
        if (isNaN(num1) || isNaN(num2)) {
            showError('Please enter valid numbers for both fields');
            return;
        }

        if (num1Input.value === '' || num2Input.value === '') {
            showError('Please fill in both number fields');
            return;
        }

        // Show loading, hide result
        showLoading(true);
        hideResult();

        // Make API call
        fetch('http://localhost:8080/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                num1: num1,
                num2: num2
            })
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading
            showLoading(false);

            if (data.result !== undefined) {
                // Update result display
                num1Value.textContent = data.num1;
                num2Value.textContent = data.num2;
                resultValue.textContent = data.result;

                // Show result with animation
                setTimeout(() => {
                    showResult();
                }, 500);

                // Show success animation
                resultDiv.style.animation = 'pulse 1s ease-in-out';
            } else {
                showError(data.error || 'Calculation failed');
            }
        })
        .catch(error => {
            showLoading(false);
            showError('Error connecting to server. Please make sure the Python server is running.');
            console.error('Error:', error);
        });
    }

    function showLoading(show) {
        if (show) {
            loadingDiv.classList.add('active');
            calculateBtn.disabled = true;
            calculateBtn.textContent = 'Calculating...';
        } else {
            loadingDiv.classList.remove('active');
            calculateBtn.disabled = false;
            calculateBtn.textContent = 'Calculate Result';
        }
    }

    function showResult() {
        resultDiv.classList.add('active');
        resultDiv.style.display = 'block';
    }

    function hideResult() {
        resultDiv.classList.remove('active');
        resultDiv.style.display = 'none';
    }

    function showError(message) {
        errorDiv.textContent = message;
        errorDiv.classList.add('error-show');
        setTimeout(() => {
            hideError();
        }, 5000);
    }

    function hideError() {
        errorDiv.classList.remove('error-show');
    }

    function resetForm() {
        num1Input.value = '';
        num2Input.value = '';
        hideResult();
        hideError();
        num1Input.focus();
    }

    // Add pulse animation to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `\
        @keyframes pulse {\
            0% { transform: scale(1); }\
            50% { transform: scale(1.05); }\
            100% { transform: scale(1); }\
        }\
    `;
    document.head.appendChild(style);
});