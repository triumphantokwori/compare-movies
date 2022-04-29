const createAutoComplete = ({
        widget,
        renderOption,
        onOptionSelect,
        inputValue,
        fetchData
    }) => {
            widget.innerHTML = `
                <label><b>Search For a Movie</b></label>
                <input type = "text" class = "input">
                <div class = "dropdown">
                    <div class = "dropdown-menu">
                        <div class = "dropdown-content results"></div>
                    </div>
                </div>
                `;

        const input         = widget.querySelector('input');
        const dropdown      = widget.querySelector('.dropdown');
        const searchResults = widget.querySelector('.results');



        const onInput = async (event) => {
            const apiData = await fetchData(event.target.value);
            
            function isEmpty(obj) {
                for (const key in obj) {
                    return false;
                }
                return true;
            }

            if (isEmpty(apiData)===true) {
                dropdown.classList.remove('is-active');
                return;
            };

            searchResults.innerHTML = '';

            dropdown.classList.add('is-active');

            for (let item of apiData) {
                const movieLink = document.createElement('a');
                
                movieLink.classList.add('dropdown-item');
                movieLink.innerHTML = renderOption(item);
                movieLink.addEventListener('click', () => {
                    input.value = inputValue(item);
                    dropdown.classList.remove('is-active');
                    onOptionSelect(item);
                });
                searchResults.appendChild(movieLink);
            }
        };


        input.addEventListener('input', debounce(onInput, 2000));

        document.addEventListener('click', event => {
            if (!widget.contains(event.target)) {
                dropdown.classList.remove('is-active');
            }
        });
}