##############################################
# Project DeepCloud
# Ardavan Bidgoli, Pedro Veloso
# based on:
# https://github.com/optas/latent_3d_points
##############################################

#########################################
# Imports
#########################################
import os
import os.path as osp
import numpy as np
import time
import matplotlib.pyplot as plt
import random
import pickle
from mpl_toolkits.mplot3d import Axes3D

from .latent_3d_points.src.ae_templates import mlp_architecture_ala_iclr_18, default_train_params
from .latent_3d_points.src.autoencoder import Configuration as Conf
from .latent_3d_points.src.point_net_ae import PointNetAutoEncoder
from .latent_3d_points.src.in_out import snc_category_to_synth_id, create_dir, PointCloudDataSet, \
                                        load_all_point_clouds_under_folder
from .latent_3d_points.src.tf_utils import reset_tf_graph


class Generator(object):
    def __init__(self, pointNumber = 2048, classIndex = 0):
        # setup variables

        self.top_out_dir = './viewer/MLCore/latent_3d_points/data/'                      
        self.top_in_dir = './viewer/MLCore/latent_3d_points/data/shape_net_core_uniform_samples_2048/'
        self.processed_data_dir = './processed_Data/'
        self.sampled_model_dir = './samples/'
        self.experiment_name = 'single_class_ae'
        self.n_pc_points = pointNumber  # Number of points per model.
        self.bneck_size = 128           # Bottleneck-AE size
        self.ae_loss = 'emd'            # Loss to optimize: 'emd' or 'chamfer'
        self.classIndex = classIndex
        self.class_names = ['cap','chair']
        self.class_name = self.class_names[classIndex]
        self.trainedDataDict = {"table":500, "chair":990, "cap":490, "car":140}
        # initializing instance
        self.readPointClouds()
        self.config()
        self.restoreModel()
        self.sampleGenerator()
        #self.interpolate(useDefault = True)
        
    def readPointClouds(self):
        # loading point clouds
        self.syn_id = snc_category_to_synth_id()[self.class_name]
        self.class_dir = osp.join(self.top_in_dir , self.syn_id)
        self.all_pc_data = load_all_point_clouds_under_folder(self.class_dir, 
                                                              n_threads=8, 
                                                              file_ending='.ply', 
                                                              verbose=True)
    
    def config(self):
        # init encoder, decoder, end_args, and dec_args
        self.train_dir = create_dir(osp.join(self.top_out_dir, self.experiment_name))
        self.train_params = default_train_params()
        self.encoder, self.decoder, self.enc_args, self.dec_args = mlp_architecture_ala_iclr_18(self.n_pc_points, self.bneck_size)
        
        # configuration
        self.conf = Conf(n_input = [self.n_pc_points, 3],
            loss = self.ae_loss,
            training_epochs = self.train_params['training_epochs'],
            batch_size = self.train_params['batch_size'],
            denoising = self.train_params['denoising'],
            learning_rate = self.train_params['learning_rate'],
            train_dir = self.train_dir,
            loss_display_step = self.train_params['loss_display_step'],
            saver_step = self.train_params['saver_step'],
            z_rotate = self.train_params['z_rotate'],
            encoder = self.encoder,
            decoder = self.decoder,
            encoder_args = self.enc_args,
            decoder_args = self.dec_args
           )
        self.conf.experiment_name = self.experiment_name
        self.conf.held_out_step = 5 # How often to evaluate/print out loss on held_out data (if any).
        self.conf.save(osp.join(self.train_dir, 'configuration'))
        
        # build AE model
        reset_tf_graph()
        self.ae = PointNetAutoEncoder(self.conf.experiment_name, self.conf)
    
    def restoreModel(self,epochIndex = 980):
        # this part should be edited to let us upload different trained models
        self.ae.restore_model(self.train_dir , epochIndex)
    
    def restoreModelAgain(self,className):
        epochIndex = self.trainedDataDict[className]
        print(self.trainedDataDict)
        print (className,epochIndex)
        # this part should be edited to let us upload different trained models
        self.ae.restore_model(self.train_dir , epochIndex)
    #########################################
    # Generative Functions
    #########################################
    # interpolates between two latent models
    def sampleGenerator(self, sampleSize = 10):
        self.feed_pc, self.feed_model_names, _ = self.all_pc_data.next_batch(sampleSize)
        self.reconstructions = self.ae.reconstruct(self.feed_pc)
        self.latent_codes = self.ae.transform(self.feed_pc)
        #self.displayReconstruction(self.reconstructions)
        
    # interpolates between two latent models
    def interpolate(self, useDefault = False,
                    number = 10, 
                    first = None, 
                    second=None):
        
        if useDefault:
            index = random.sample(range(0, len(self.latent_codes)), 2)
            first = self.latent_codes[index[0]]
            second= self.latent_codes[index[-1]]
            
        d = second-first
        intpol = []
        for i in range(number):
            tmp = first + i/number * d
            intpol.append(tmp)
        intpol = np.array(intpol)
        interpolates = self.ae.decode(intpol)
        self.displayPointCloud(interpolates)
        message = self.formatData(interpolates)
        return (message)
    
    # reads a latent space vector and converts it into a point cloud
    def ptFromLatent(self, latentVec = None):
        if latentVec == None:
            #print ("From None")
            latentVec = self.latent_codes
        pts = self.ae.decode(latentVec)
        message =  self.formatPointData(pts)
        return (message)
        
    
    #########################################
    # Displaying functions
    #########################################
    def displayReconstruction(self, reconstructions):
        pointCloud,_ = (reconstructions) 
        self.displayPointCloud(pointCloud)
        
    def displayPointCloud(self,pointCloud):
        fig = plt.figure(num=None, figsize=(12, 10),
                         dpi=80, facecolor='w',
                         edgecolor='k')
        
        for i in range (pointCloud.shape[0]):
            
            pts = pointCloud[i,:,:]
            col = int (i % 3)
            row = int(col *3)
            curAxis = fig.add_subplot(4,3,i+1, projection='3d')
            ptX = [pt[0] for pt in pts ]
            ptY = [pt[1] for pt in pts ]
            ptZ = [pt[2] for pt in pts ]
            col = random.sample(range(0, 100), 3)
            #col = (50,50,50, .1)
            curAxis.scatter(ptX, ptY, ptZ, color=[float(col[0])/100.0, 
                                                     float(col[1])/100.0, 
                                                     float(col[2])/100.0], 
                                                    marker='o')
            
    def showSamples(self, n = 10, start = 0):
        samples = self.latent_codes[start:start+n]
        self.outPut = self.ae.decode(samples) 
        self.displayPointCloud(self.outPut)
    
    #########################################
    # Simple processing functions
    #########################################    
    def getLatentRange(self):
        self.maxData = (np.amax(latent_codes, axis = 0))
        self.minData = (np.amin(latent_codes, axis = 0))
        self.rangeData = maxData - minData
    
    def formatPointData(self,data):
        result = ""
        for i in range(data.shape[0]):
            for j in range (data.shape[1]):
                for k in range (data.shape[2]):
                    result = result + str(data[i,j,k]) 
                    if k < data.shape[2]-1:
                         result = result +","
                if j < data.shape[1]-1:
                    result = result +";"
            if i < data.shape[0]-1:
                    result = result +"|"
        return (result)

    #########################################
    # saving functions
    #########################################     
    # all recording and saving functions
    def recordData(self):
        path =self.processed_data_dir
        self.checkPathExist(path)
            
        self.writePickle(self.rangeData, path,"range")
        self.writePickle(self.maxData, path,"max")
        self.writePickle(self.minData, path,"min")

    
    def checkPathExist(path):
        if not os.path.exists(path):
            os.makedirs(path)
            
    def sameSamplesJSON(self, oneFile = False):
        path = self.sampled_model_dir
        self.checkPathExist(path)
        
        # to save all samples as one JSON file
        if oneFile:
            recon_ = self.recon[:,:,:]
            fileName = "samples.json".format(i) 
            filePath = os.path.join(path, fileName)
            json.dump(recon_.tolist(), codecs.open(filePath, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4) ### this saves the array in .json format
        
        # to save each samples seperately
        else:
            for i in range (len(self.recon)):
                if (i < 10):
                    number = "0"+str(i)
                file_path = "test_{}.json".format(number) 
                json.dump(self.recon[i].tolist(), codecs.open(file_path, 'w', encoding='utf-8'), separators=(',', ':'), sort_keys=True, indent=4) ### this saves the array in .json format
                
                
    def writePickle(self,data,path, fileName):
        if type(data) == np.ndarray and type(fileName) == str :
            fileName = fileName+".p"
            filePath = os.path.join(path, fileName)
            with open(filePath, 'wb') as f: 
                pickle.dump(data.tolist(), f, protocol = 2)
        else:
            print ("invalid name or data")

