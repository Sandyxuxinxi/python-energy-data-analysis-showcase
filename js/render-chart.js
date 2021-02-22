const siteNames = Object.keys(window.sandyPredictionData);

document.querySelector('#siteName').innerHTML = siteNames.map((siteName) => {
    return `<option value="${siteName}">${siteName}</option>`
});

function renderChart(siteName) {
    const dataForThisSite = window.sandyPredictionData[siteName];

    const datasetNames = [...Object.values(dataForThisSite).reduce((uniqueDatasetNames, dataForTimestamp) => {
        const datasetsInThisTimestamp = Object.keys(dataForTimestamp);
        datasetsInThisTimestamp.forEach((datasetName) => {
            uniqueDatasetNames.add(datasetName);
        })
        return uniqueDatasetNames;
    }, new Set())];

    const chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };
    const colors = Object.values(chartColors);

    const emptyDatasets = datasetNames.reduce((emptyDataset, datasetName, index) => {
        return {
            ...emptyDataset,
            [datasetName]: {
                label: datasetName,
                data: [],
                fill: false,
                borderColor: colors[index],
                backgroundColor: colors[index],
            }
        }
    }, {});

    const timestamps = Object.keys(dataForThisSite);

    const datasets = Object.values(dataForThisSite).reduce((compiledDatasets, valuesForTimestamp) => {
        datasetNames.forEach((datasetName) => {
            const valueForDataset = valuesForTimestamp[datasetName];

            compiledDatasets[datasetName].data.push(valueForDataset);
        });

        return compiledDatasets;
    }, emptyDatasets);

    const chartJSConfig = {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: Object.values(datasets)
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: `Predictions for ${siteName}`
            },
        }
    };

    const ctx = document.getElementById('prediction-chart').getContext('2d');
    window.myLine = new Chart(ctx, chartJSConfig);
}

document.querySelector('#siteName').addEventListener('change', (event) => {
    document.querySelector('#chart-div').innerHTML = `<canvas id="prediction-chart"></canvas>`;
    renderChart(event.target.value);
});

renderChart('Vineyard Pump station                            - 4311180579');
