from create_brain_data import create_brain_data
import json
import multiprocessing
from flask import Flask, request, jsonify

app = Flask(__name__)

'''
subjects_id, 
trial_id,
plot_sensors=False,
plot_annotation=False,
picks="hbo",
selected_events=['a', 'b'],
initial_time=0,
end_time=None
'''
@app.route('/process-brain-data', methods=['POST'])
def process_get_brain():
    data = json.loads(request.json)
    print(f'type: {type(data)} data: {data}')
    
    subjects_id = data['subjects_id']
    trial_id = data['trial_id']
    plot_sensors = data['plot_sensors']
    plot_annotation = data['plot_annotation']
    picks = data['picks']
    selected_events = data['selected_events']
    initial_time = data['initial_time']
    end_time = data['end_time']
    
    # run on seperate core
    pool = multiprocessing.Pool()
    result_image = pool.apply(create_brain_data, (subjects_id, 
                                                  trial_id, 
                                                  plot_sensors, 
                                                  plot_annotation, 
                                                  picks, 
                                                  selected_events, 
                                                  initial_time, 
                                                  end_time))
    pool.close()
    pool.join()
    
    if result_image is None:
        return jsonify({'error': 'No data found for the specified subjects_id and trial_id'})
    else:
        return jsonify('image: ', result_image.tolist())
    
def run_app(port=8001):
    app.run(debug=True, port=port)

if __name__ == '__main__':
    run_app()
