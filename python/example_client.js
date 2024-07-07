async function fetchProcessedData(data) {
    const response = await fetch('http://localhost:8001/process-brain-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return response.json();
}

data = {
    "subjects_id": "0293",
    "trial_id": "13",
    "plot_sensors": False,
    "plot_annotation": False,
    "picks": "hbo",
    "selected_events": ['a', 'b'],
    "initial_time": 0,
    "end_time": None
}