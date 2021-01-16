<<<<<<< Updated upstream
print('Hello world')
=======
import cv2


'''
1. Get contours for object detection
2. Balance it by removing the outliars
3. Find the bottom right coordinate and top left 
4. Crop the image based on the 4 ^ coordinates
'''

img = cv2.imread('Hack_the_North_Test_Test_-_Filled-page-001.jpg')

def get_contours(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY) 

    edged = cv2.Canny(gray, 30, 200) 

    contours, hierarchy = cv2.findContours(edged, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE) 
    

    # Draw all contours 
    cv2.drawContours(img, contours, -1, (0, 255, 0), 3) 
    cv2.imshow('Contours', img) 
    cv2.waitKey(0) 
    cv2.destroyAllWindows()

s1(img)
>>>>>>> Stashed changes
