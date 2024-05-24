# HuBar

HuBar is a visual analytics tool to explore human behavior using fNIRS data in AR guidance systems.

![System screen](https://github.com/soniacq/HuBar/blob/master/imgs/HuBar_system.png)


## Install

~~~~
npm install
npx webpack
python -m http.server
~~~~

## Data Setup

To set up the required data for HuBar, follow these steps:

1. Unzip the `data.zip` file in the same directory where it is located.

2. Within the unzipped `data` folder, create a new folder named `video`.

3. Inside the `video` folder, organize your recordings (videos) according to each session in the Ocarina dataset. If you don't have access to the video sessions, please contact [s.castelo@nyu.edu](mailto:s.castelo@nyu.edu) to obtain a copy of the videos.

   The folder structure within the `video` folder should be organized as follows:
   ```
    ├── ...
    ├──data                   
    │  ├── video        # Folder containing all videos               
    │  |  ├── [participant_ID]     
    |  |  |  ├── [trial_ID]   
    |  |  |  |  ├── hl2_rgb
    |  |  |  |  |  ├── codec_hl2_rgb_vfr.mp4
    |  |  ...   
    └────────────────────────────────────────────────────────────────────────────
    ```
