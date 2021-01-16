from pdf2image import convert_from_path
import cv2
import numpy as np
images = convert_from_path('Hack the North Test Test - Filled.pdf')
img =  cv2.cvtColor(np.array(images[0]), cv2.COLOR_RGB2BGR)
gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

thresh_inv = cv2.bitwise_not(cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 5, 1))

# Blur the image
blur = cv2.GaussianBlur(thresh_inv,(1,1),0)

cv2.imshow("a", blur)

thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]

# find contours
contours = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0]

mask = np.ones(img.shape[:2], dtype="uint8") * 255
for c in contours:
    # get the bounding rect
    x, y, w, h = cv2.boundingRect(c)
    if w*h>250000:
        cv2.rectangle(mask, (x, y), (x+w, y+h), (0, 0, 255), -1)

res_final = cv2.bitwise_and(img, img, mask=cv2.bitwise_not(mask))

cv2.imshow("boxes", mask)
cv2.imshow("final image", res_final)
cv2.waitKey(0)
cv2.destroyAllWindows()
