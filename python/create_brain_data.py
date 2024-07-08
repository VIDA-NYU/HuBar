import os
import glob
import pickle

import timeit

import pandas as pd
import numpy as np

import matplotlib.pyplot as plt

import mne
import mne_nirs

from mne import stc_near_sensors, read_source_spaces
from mne.io.constants import FIFF

PATH_TO_DATA = '../data/'
PATH_TO_SUBJECTS = os.path.join(PATH_TO_DATA, 'subjects/')
PATH_TO_EVENTS = os.path.join(PATH_TO_DATA, 'subjects', 'filtered_data_procedures.csv') 

NIRS_SRATE = 10.42

# number_of_channels = 16
# number_of_detectors = 10
NIRS_COORDS = {
    # 0.0254 meters per inch

    'D1':np.array((-0.04,0.09,0)),
    'D2':np.array((-0.04,0.09,0.02)),

    'S1':np.array((-0.03,0.1,0.01)),

    'D3':np.array((-0.02,0.1,0)),
    'D4':np.array((-0.02,0.1,0.02)),

    'S2':np.array((-0.01,0.1,0.01)),

    'D5':np.array((0,0.1,0)),
    'D6':np.array((0,0.1,0.02)),

    'S3':np.array((0.01,0.1,0.01)),

    'D7':np.array((0.02,0.1,0)),
    'D8':np.array((0.02,0.1,0.02)),

    'S4':np.array((0.03,0.1,0.01)),

    'D9':np.array((0.04,0.09,0)),
    'D10':np.array((0.04,0.09,0.02)),
}


def read_events(subject_id, 
                trial_id):
    events = []
    realized_event_ids = {}
    t_min = 0
    t_max = 0

    eventsDf = pd.read_csv(PATH_TO_EVENTS)
    eventsValues = eventsDf[ (eventsDf['subject_id'] == int(subject_id)) & (eventsDf['trial_id'] == int(trial_id))  ][['seconds', 'Step']].values

    if len(eventsValues) != 0:
        maps = {'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f':6}
        eventRepeated = set()
        realizedMaps = {}
        for e in eventsValues:
            time_index = int(e[0]*NIRS_SRATE)

            if( time_index in eventRepeated ):
                continue

            eventRepeated.add(time_index)
            events.append([ time_index, 0, maps[e[1]] ])
            realizedMaps[e[1]] = maps[e[1]]
            
        events = np.array(events) # timestamps, duration, event_id

        if len(events) != 0:
            # Check duration of events
            event_durations = events.copy()
            # Get duration in seconds
            for i in range(0, len(event_durations)-1):
                event_durations[i, 1] = (event_durations[i+1, 0]-event_durations[i, 0]) / NIRS_SRATE
            event_durations[-1, 1] = 999

            # Drop events that are too short
            events = events[event_durations[:, 1] > 7]
            event_durations = event_durations[event_durations[:, 1] > 7]

            t_min = -5
            t_max = event_durations[:, 1].min()
            if t_max > 10:
                t_max=10

            # cut realized_maps to the events that are actually used
            realized_event_ids = {k: v for k, v in realizedMaps.items() if v in events[:, 2]}
    else:
        print(f"No events found for {subject_id} {trial_id}")

    return events, realized_event_ids, t_min, t_max

def get_trial_dataframe(subjects_id, trial_id):
    df_measurements = None

    columns = []
    for i in range(1,17):
        for j in ['HbO', 'HbR']:
            columns.append(f'opt{i}_{j}')

    single_subject_csv_path = os.path.join(PATH_TO_SUBJECTS, f'{subjects_id}_{trial_id}.csv')
    if os.path.exists(single_subject_csv_path):
        df = pd.read_csv(single_subject_csv_path)
        df_measurements = df[columns].transpose()
        # df_measurements.reset_index(drop=True, inplace=True)
        df_measurements.dropna(inplace=True, axis=1)
    else:
        print(f"No data found for {subjects_id} {trial_id}")

    return df_measurements

def create_mne_raw_object(df_measurements):
    # raw hbo data and  hbr data
    data = pd.DataFrame(data=df_measurements)

    x_offset = 0
    y_offset = 0
    z_offset = 0.03

    for key in NIRS_COORDS.keys():
        NIRS_COORDS[key] = NIRS_COORDS[key] + np.array([x_offset, y_offset, z_offset])

    ch_names_base = ['S1_D1', 'S1_D2', 'S1_D3', 'S1_D4', 'S2_D3', 'S2_D4', 'S2_D5', 'S2_D6', 'S3_D5', 'S3_D6', 'S3_D7','S3_D8','S4_D7','S4_D8','S4_D9','S4_D10']
    ch_names = []
    for ch in ch_names_base:
        ch_names.append(ch + ' hbo')
        ch_names.append(ch + ' hbr')

    ch_types = [ "hbo", "hbr",] * len(ch_names_base)
    sfreq = 10.0  # in Hz

    print(ch_names)
    print(f"Channel Names length {len(ch_names)}")
    print(f"Channel Types length {len(ch_types)}")

    info = mne.create_info(ch_names=ch_names, ch_types=ch_types, sfreq=sfreq)
    raw = mne.io.RawArray(data, info, verbose=True)

    # nasian = (-4.62,82.33,-45.74)
    # rpa = (79.66,-18.72,-45.89)
    # lpa = (-81.41,-17.18,-45.56)
    montage = mne.channels.make_dig_montage(NIRS_COORDS, coord_frame='mni_tal')
    montage.remove_fiducials()

    raw.set_montage(montage)
    montage = raw.get_montage()

    # montage.plot(kind="topomap", show_names=True, show=True)
    # # raw.plot_sensors(kind="3d", show_names=True, show=True)
    # input("Press Enter to continue...")

    # events_tmp, annotations = mne.events_from_annotations(raw)
    # reversed_events = {v: k for k, v in annotations.items()}
    # raw.plot(n_channels=32, event_id=reversed_events, events=events_tmp, block=True)

    return raw

def create_mne_epochs_object(raw, 
                             events, 
                             event_ids, 
                             t_min, 
                             t_max):
    # reject_criteria = dict(hbo=80e-6)
    # regect_criteria = dict(hbo=1e-6, hbr=1e-6)

    # Create epochs
    epochs = mne.Epochs(raw, 
                        events, 
                        event_id=event_ids, 
                        tmin=t_min, 
                        tmax=t_max, 
                        proj=True,
                        baseline=(None, 0), 
                        # reject=reject_criteria, 
                        preload=True, 
                        detrend=None, 
                        verbose=True)

    return epochs

def plot_channel_hemodynamic_response(evoked, 
                                      subject_id, 
                                      event,
                                      picks,
                                      selected_channels_hbo= ['S1_D1 hbo'], 
                                      selected_channels_hbr= ['S1_D1 hbr']):
    # read pickle
    with open(f'./data/{subject_id}_{trial_id}_{event}_{picks}_channels.pkl', 'rb') as f:
        fig = pickle.load(f)
        # get axes
        ax = fig.get_axes()[0]
    # fig, ax = plt.subplots(1, 1, figsize=(12, 6))

    # Plot hbo, hbr for selected channels on same plot
    hbo_evoked_data = evoked.copy().pick(picks=selected_channels_hbo).get_data()
    hbr_evoked_data = evoked.copy().pick(picks=selected_channels_hbr).get_data()
    ax.plot(evoked.times, hbo_evoked_data.T, color='r', label='HbO')
    ax.plot(evoked.times, hbr_evoked_data.T, color='b', label='HbR')
    # Add channel names to plot orient text along lines
    for i, ch in enumerate(selected_channels_hbo):
        ax.text(evoked.times[0]+0.2, hbo_evoked_data[i, 0], f'{subject_id} {ch.strip(" hbo")}', rotation=45, rotation_mode='anchor', fontsize=8)
    for i, ch in enumerate(selected_channels_hbr):
        ax.text(evoked.times[0]+0.2, hbr_evoked_data[i, 0]+0.01, f'{subject_id} {ch.strip(" hbr")}', rotation=45, rotation_mode='anchor', fontsize=8)
    
    # pickle plot
    # with open(f'./data/{subject_id}_{trial_id}_{event}_{picks}_channels.pkl', 'wb') as f:
    #     pickle.dump(fig, f)

    plt.title(f"Hemodynamic Response")
    plt.xlabel('Time (s)')
    plt.ylabel('concentration')
    plt.legend()
    # plt.savefig(f'./data/all_2_channels.png')

def plot_3d_evoked_array(ea, 
                        plot_sensors=False, plot_annotation=False, view=None, 
                        picks="hbo", time_to_average=0, background='w', 
                        figure=None, clim='auto', mode='weighted', 
                        colormap='RdBu_r', surface='pial', hemi='both', 
                        size=800, colorbar=False, distance=0.03,
                        subjects_dir=None, src=None, verbose=False):


    # TODO: mimic behaviour of other MNE-NIRS glm plotting options
    if picks is not None:
        ea = ea.pick(picks=picks)

    if subjects_dir is None:
        sample_data_folder = mne.datasets.sample.data_path()
        subjects_dir = sample_data_folder / "subjects"
    if src is None:
        fname_src_fs = os.path.join(subjects_dir, 'fsaverage', 'bem',
                                    'fsaverage-ico-5-src.fif')
        src = read_source_spaces(fname_src_fs)

    picks = np.arange(len(ea.info['ch_names']))

    # Set coord frame
    for idx in range(len(ea.ch_names)):
        ea.info['chs'][idx]['coord_frame'] = FIFF.FIFFV_COORD_HEAD

    # Generate source estimate
    kwargs = dict(
        evoked=ea, subject='fsaverage', trans='fsaverage',
        distance=distance, mode=mode, surface=surface,
        subjects_dir=subjects_dir, src=src, project=True)
    stc = stc_near_sensors(picks=picks, **kwargs, verbose=verbose)

    # Produce brain plot
    brain = stc.plot(src=src, subjects_dir=subjects_dir, hemi='both',
                     surface=surface, initial_time=time_to_average, time_unit='s', clim=clim, size=size,
                     colormap=colormap, figure=figure, background=background, #backend='notebook',
                     colorbar=colorbar, verbose=verbose, alpha=1, time_viewer=False, )

    if plot_sensors:
        brain.add_sensors(ea.info, trans='fsaverage', fnirs=dict(channels=1, pairs=0.5, sources=0.5, detectors=0.5))
    if plot_annotation:
        brain.add_annotation("aparc.a2009s", borders=True, alpha=0.7)
    if view is not None:
        brain.show_view(view, azimuth=90, elevation=80, distance=350)
    else:
        brain.show_view(azimuth=90, elevation=80, distance=350)

    return brain


def plot_evoked(subject_id, 
                trial_id, 
                epochs, 
                picks="hbo",
                selected_events=[],
                time_to_average=0,
                plot_brain=True, 
                plot_channels=True,
                plot_sensors=True,
                plot_annotation=True,):
    
    brain = None
    hemodynamic_response = None
    
    # get annotations
    selection = epochs.selection
    event_id = epochs.event_id
    print(selection)
    print(event_id)

    events = list(event_id.keys())
    if len(selected_events) == 0:
        selected_events = events
    else:
        check_for_atleast_one = False
        for event in selected_events:
            if event in events:
                check_for_atleast_one = True
                break
        if not check_for_atleast_one:
            print(f"No selected events ({selected_events}) found in subject {events}")
            return brain, hemodynamic_response
        events = selected_events

    print(f"Selected Events: {events}")

    evoked = epochs[selected_events].copy().average()
    if plot_channels:
        hemodynamic_response = plot_channel_hemodynamic_response(evoked,
                                            event,
                                            picks,)

    if plot_brain:
        brain = plot_3d_evoked_array(evoked, picks=picks, 
                            plot_sensors=plot_sensors, 
                            plot_annotation=plot_annotation,
                            time_to_average=time_to_average,
                            surface='pial',
                            verbose=False, )
            
    return brain, hemodynamic_response
        

def create_brain_data(subjects_id, 
         trial_id, 
         plot_sensors=False, 
         plot_annotation=False, 
         picks="hbo",
         selected_events=[],
         initial_time=0,
         end_time=None):
    
    image = None
    
    start_timer = timeit.default_timer()

    df = get_trial_dataframe(subjects_id, trial_id)
    events, realized_event_ids, t_min, t_max = read_events(subjects_id, 
                                                           trial_id)

    if len(events) != 0 and df is not None:
        raw = create_mne_raw_object(df)
        epochs = create_mne_epochs_object(raw, 
                                        events, 
                                        realized_event_ids, 
                                        t_min, 
                                        t_max)

        brain, hemodynamic_response  = plot_evoked(subjects_id, 
                    trial_id, 
                    epochs, 
                    picks=picks,
                    selected_events=selected_events,
                    time_to_average=5, 
                    plot_brain=True,
                    plot_channels=False,
                    plot_sensors=plot_sensors,
                    plot_annotation=plot_annotation)

        if brain is not None:
            print(f'Done  {subjects_id} {trial_id} {selected_events}: {timeit.default_timer() - start_timer}')
            image = brain.screenshot(mode='rgb', time_viewer=False)

    if image is None:
        print(f"No events/data found for {subjects_id} {trial_id} {selected_events}")

    return image

if __name__ == '__main__':
    subjects_id, trial_id = '0293', '13'

    # for event in ['a', 'b', 'c', 'd', 'e', 'f']:
    #     image = create_brain_data(subjects_id, 
    #         trial_id,
    #         plot_sensors=False,
    #         plot_annotation=False,
    #         picks="hbo",
    #         selected_events=[event],
    #         initial_time=0,
    #         end_time=None)
    #     plt.imshow(image)
    #     plt.show()
        
    #     input("Press Enter to continue...")

    image = create_brain_data(subjects_id, 
            trial_id,
            plot_sensors=False,
            plot_annotation=False,
            picks="hbo",
            selected_events=['a', 'b'],
            initial_time=0,
            end_time=None)
    plt.imshow(image)
    plt.show()
    input("Press Enter to continue...")
