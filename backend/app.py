from fastapi import FastAPI
from socket_handler import socket_manager
from fastapi.middleware.cors import CORSMiddleware
import asyncio

from pyfingerprint.pyfingerprint import PyFingerprint
from pyfingerprint.pyfingerprint import FINGERPRINT_CHARBUFFER1
from pyfingerprint.pyfingerprint import FINGERPRINT_CHARBUFFER2


## Search for a finger
##

## Tries to initialize the sensor
try:
    f = PyFingerprint('/dev/ttyS0', 57600, 0xFFFFFFFF, 0x00000000)

    if ( f.verifyPassword() == False ):
        raise ValueError('The given fingerprint sensor password is wrong!')

except Exception as e:
    print('The fingerprint sensor could not be initialized!')
    print('Exception message: ' + str(e))
    
async def searchFinger():
    print("sus")
    while ( f.readImage() == False ):
        pass

    ## Converts read image to characteristics and stores it in charbuffer 1
    f.convertImage(FINGERPRINT_CHARBUFFER1)

    ## Searchs template
    result = f.searchTemplate()

    positionNumber = result[0]
    accuracyScore = result[1]

    if ( positionNumber == -1 ):
        print('No match found!')
        await socket_manager.send("No match found!")
    else:
        print('Found template at position #' + str(positionNumber))
        print('The accuracy score is: ' + str(accuracyScore))
        await socket_manager.send("Found template at position #" + str(positionNumber))

async def handle_search_fingerprint(sus):
    try:
        await searchFinger()
        
    except:
        print("Error while searching for fingerprint")
        await socket_manager.send("Error while searching for fingerprint")
        
async def enroll_finger(sus):
    try:
        print("sus")
        while ( f.readImage() == False ):
            pass

        f.convertImage(FINGERPRINT_CHARBUFFER1)

        result = f.searchTemplate()
        positionNumber = result[0]

        if ( positionNumber >= 0 ):
            print('Template already exists at position #' + str(positionNumber))
            await socket_manager.send("Template already exists at position #" + str(positionNumber))
            return

        print('Remove finger...')
        await socket_manager.send("Remove finger...")
    except:
        print("Error while enrolling fingerprint")
        await socket_manager.send("Error while enrolling fingerprint")

async def compareFinger(sus):
    ## Wait that finger is read again
    while ( f.readImage() == False ):
        pass

    ## Converts read image to characteristics and stores it in charbuffer 2
    f.convertImage(FINGERPRINT_CHARBUFFER2)

    ## Compares the charbuffers
    if ( f.compareCharacteristics() == 0 ):
        await socket_manager.send('Fingers do not match')
        return

    ## Creates a template
    f.createTemplate()

    ## Saves template at new position number
    positionNumber = f.storeTemplate()
    print('Finger enrolled successfully!')
    print('New template position #' + str(positionNumber))
    await socket_manager.send("Finger enrolled successfully!")
    
async def deleteFinger(sus, finger):
    if ( f.deleteTemplate(finger) == True ):
        print('Template deleted!')
        await socket_manager.send("Template deleted!")
        
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can change this to specific origins for more security.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/fingerprints')
async def listFingerprints():
    tableIndex = f.getTemplateIndex(0)

    return tableIndex

socket_manager.mount_to("/socket.io", app)

socket_manager.on("searchFingerprint", handler=handle_search_fingerprint)
socket_manager.on("enrollFinger", handler=enroll_finger)
socket_manager.on("compareFinger", handler=compareFinger)
socket_manager.on("deleteFinger", handler=deleteFinger)