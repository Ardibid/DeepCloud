from django.shortcuts import render
from django.http import HttpResponse
from django.template.response import TemplateResponse
# this is how we import from the other python files
# note: it only searches the subfolders, not upper folders!
# in JS we can do so, but in python nope!

from .MLCore.latent_3d_points.testPathFile import testPath
from .MLCore.AutoEncoder import *
import copy

# Create your views here. 
bneck = 32
gen = None
gen = Generator()
state = [np.random.uniform(-100, 100, (3, bneck))]


def viewer(request):
    return render (request, 'viewer.html')


def hybridEdit(request):
    return TemplateResponse (request, 'hybridEdit.html', {'myData':"THIS IS A SIMPLE MESSAGE"})

intitialLatentVector = np.array(())
def loadModelByName(request):
    print ("---------------")
    print ("loading a new model")
    print(request)
    print ("---------------")

    global gen
    try:
        tmp=(request.GET["data0"])
        className = tmp.split(",")[0]
        print ("loading this model:",className)
        gen.restoreModelAgain(className)
        modelIndex = tmp.split(",")[1]
        modelIndex = modelIndex.split("=")[1]
        print ("++++000++++")
        print (className,modelIndex)
        loadInstanceLatentVectore(className,modelIndex)
        return HttpResponse("Loading")
    except:
        return HttpResponse("Fail")

def loadInstanceLatentVectore(className,index):
    global intitialLatentVector
    print ("++++111++++")
    path = "./DeepCloud/static/latentVectors/"+className+".npy"
    latentVectors = np.load(path)
    print (latentVectors.shape,className,index)
    intitialLatentVector = latentVectors[int(index)]
    print ("++++222++++")
    print (intitialLatentVector.shape, className,index)
    print ("-------------")

    return latentVectors[index]



def interpolate(vectors, weights):
    total_weight = np.sum(weights)
    if total_weight == 0: 
        total_weight = 1
    weights = weights / total_weight
    total = np.dot(weights, vectors)
    return total

def loadLatentVectors(className, indices):
    list_vectors = []
    for i in indices:
        list_vectors.append(loadInstanceLatentVectore(className,i))
    latentVectors = np.array(list_vectors)
    return latentVectors

def hybrid2PC(request):
    global intitialLatentVector
    try:
        indices = []
        weights = []
        n = (int(request.GET["data0"]))
        objectClass = (str(request.GET["data1"]))
        for i in range(2,2 + n): 
            indices.append(int(request.GET["data"+str(i)]))
        for i in range(2 + n, 2 + 2 * n):
            weights.append(float(request.GET["data"+str(i)]))
        vectors = loadLatentVectors(objectClass, indices)
    except:
        return HttpResponse("Fail")
        
    data = interpolate(vectors, np.array(weights))    
    pc = latentProcess(data)
    return HttpResponse(pc)


def latent2PC(request):
        # reads a latent space vector from JS
    global intitialLatentVector
    try:
        data = []
        for i in range(32):
            tag = "data"+str(i)
            data.append(float(request.GET[tag]))
        #print (data)
        
    except:
        return HttpResponse("Fail")

    # n = np.random.randint(0,10, size=1)
    # path = "./DeepCloud/static/samples/hat" + str(n[0]) + ".npy"
    # sampleLatent = np.load(path)/10.0

    sampleLatent = np.array(intitialLatentVector)
    print ("-------------")
    print (sampleLatent.shape)
    print ("-------------")
    data = sampleLatent + data
    
    pc = latentProcess(data)
    return HttpResponse(pc)

def latentProcess(data):
    """ 
    generate random feature vector and loads a pc
    sends the pc to js
    
    """ 
    global gen

    feature_vector = np.array(data)
    #pc = loadPC("0")
    #pc = [[0, 1, 2],[3, 4],[5, 6, 7, 8],[9]]
    pc = gen.ae.decode(feature_vector)[0]
    #print(pc.shape)

    result = ""
    
    #1) convert all but the last point
    for i in range(len(pc)-1):
        for j in range(len(pc[i]) - 1):
            result += str(pc[i][j])
            result += ","
        #last coordinate of points
        result += str(pc[i][-1])
        result += ";"

    #2) convert the first 2 coordinates of the last point
    for j in range(len(pc[-1]) - 1):
        result += str(pc[-1][j])
        result += ","

    #3) convert the last coordinate of the last point
    result += str(pc[-1][-1])
    print("produced point cloud", pc[0][0], pc[0][1], pc[0][2], result[:30])
    return result

# boiler plate functions
def quickPt(request):
    pts = gen.ptFromLatent()
    try:
        return HttpResponse(pts)
    except:
        return HttpResponse("Fail")

def loadInitialPC():
    data = intitialLatentVector


###################################################
#### Pedro's Functions
###################################################
def loadPC(n):
    path = "./DeepCloud/static/pointClouds/pc" + str(n) + ".npy"
    return np.load(path)

def randomPC(request):
    """ 
    generate random feature vector and loads a pc
    sends the pc to js
    
    """ 
    global gen

    feature_vector = np.random.uniform(-100, 100, (3, bneck))
    #pc = loadPC("0")
    #pc = [[0, 1, 2],[3, 4],[5, 6, 7, 8],[9]]
    pc = gen.ae.decode(feature_vector)[0]
    #print(pc.shape)

    result = ""
    
    #1) convert all but the last point
    for i in range(len(pc)-1):
        for j in range(len(pc[i]) - 1):
            result += str(pc[i][j])
            result += ","
        #last coordinate of points
        result += str(pc[i][-1])
        result += ";"

    #2) convert the first 2 coordinates of the last point
    for j in range(len(pc[-1]) - 1):
        result += str(pc[-1][j])
        result += ","

    #3) convert the last coordinate of the last point
    result += str(pc[-1][-1])
    print("produced point cloud", pc[0][0], pc[0][1], pc[0][2], result[:30])
    return HttpResponse(result)

def randomPCs(request):
    """ 
    generate random feature vector and loads a pc
    sends the pc to js
    + sends sequence of pcs for animation
    
    """ 
    global gen
    global bneck
    global state

    state.append(np.random.uniform(-100, 100, (3, bneck)))
    #pc = loadPC("0")
    #pc = np.array(list(range(60))).reshape(5, 4, 3)
    pc = gen.ae.interpolate(state[0], state[1], 10)
    print(pc.shape)

    for i in range(len(pc)-1):
        #1) convert all but the last point
        for j in range(len(pc[i]) - 1):
            for k in range(len(pc[i][j]) - 1):
                result += str(pc[i][j][k])
                result += ","
            #last coordinate of points
            result += str(pc[i][j][-1])
            result += ";"
        
        #1) convert all but the last point
        for k in range(len(pc[i][-1]) - 1):
            result += str(pc[i][-1][k])
            result += ","
        result += str(pc[i][-1][-1])
        result += "|" 

    #last point cloud
    for j in range(len(pc[-1])):
        for k in range(len(pc[i][j]) - 1):
            result += str(pc[i][j][k])
            result += ","
        #last coordinate of points
        result += str(pc[i][j][-1])
        result += ";"
    
    #1) convert all but the last point
    for k in range(len(pc[-1][-1]) - 1):
        result += str(pc[-1][-1][k])
        result += ","
    result += str(pc[-1][-1][-1])  

    #3) convert the last coordinate of the last point
    result += str(pc[-1][-1])
    #print("produced point cloud", pc[0][0], pc[0][1], pc[0][2], result[:30])
    state = state.pop(0)
    return HttpResponse(result)




###################################################
#### Boiler palte functions
###################################################

# this function collects something from JS
# and then send a message back
def templatePyFunctionReceive(request):
    # reads a latent space vector from JS
    try:
        data = []
        for i in range(8):
            tag = "data"+str(i)
            data.append(float(request.GET[tag]))
        print (data)
        return HttpResponse("Good job!")
    except:

        return HttpResponse("Fail")

# this function sends something to JS
# JS recieves the data
def templatePyFunctionSend(request):
    # data to be transfered
    data =[0,1,2]
    # placeholder for data
    result = ""
    for i in range (len(data)-1):
    	result = result + str(data[i]) + ","
    # last piece should be ended by ;
    result = result + str(data[-1]) + ";"
    # send data back
    testPath(1024)
    return HttpResponse(result)

    