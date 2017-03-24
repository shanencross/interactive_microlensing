# Binary Gravitational Lens plotter
# Plots Critical Curves, Caustics, Lightcurve
# Measures u_0 from midpoint between the two masses
# comments prefixed with "e:" are edits inserted by Shanen Cross

# v1.0 - Y. Tsapras Oct 2014

# Import dependencies
import numpy as np
import matplotlib.pyplot as plt
from bin_ima import bin_ima
import time

# GM1 = mass of object 1 (as a % of total mass) e.g. 0.1
# GM2 = mass of object 2 (as a % of total mass) e.g  0.9
# D = half binary separation (between components) in Einstein radii
# cof1, cof2 = trajectory coefficients (trajectory of the
#              form Y = cof1 * X + cof2 [[use small values]])

# e: GM2 value doesn't seem to change anything.
# e: Instead it appears GM2 is set equal to 1 - GM1

# Plot critical and caustic curves for the binary lens
def plot_binary(GM1, GM2, D, cof1, cof2, NPN=400):
   print ("test GM1: %s" % GM1)
   print ("test GM2: %s" % GM2)
   # Initialize arrays
   # y,x coords of source and magnification ASA
   # Define the number of points (NPN) to use for the trajectory
   #NPN = 40;
   XSA, YSA, ASA = np.zeros(NPN), np.zeros(NPN), np.zeros(NPN)
   AIA = np.zeros(shape = (5, NPN))
   # Initialize arrays holding critical curve and caustic points
   critical_points_x1, critical_points_y1 = np.array([]), np.array([])
   critical_points_x2, critical_points_y2 = np.array([]), np.array([])
   caustic_points_x1, caustic_points_y1  = np.array([]), np.array([])
   caustic_points_x2, caustic_points_y2  = np.array([]), np.array([])

   # Set plot limits
   XLM = 3 # Trajectory from -XLM to +XLM R_E

   IP  = -1
   GM2 = 1 - GM1
   RE1, ZR1 = np.sqrt(GM1), np.sqrt(GM1)
   RE2, ZR2 = np.sqrt(GM2), np.sqrt(GM2)
   D2 = D * D
   D4 = D2 * D2

   NR = 300000 # Points to use to plot critical curves and caustics
   DR = 0.00001 # Used to define the sampling density of the caustics

   # Estimate criticals and caustics
   # Perform repeat calculations with masses swapped over
   for IQ in range(0,2):
      IR = np.arange(1, NR)
      # Define some variables that are used repeatedly
      R = IR * DR
      R2 = R * R
      R4 = R2 * R2
      GM1S = GM1 * GM1
      GM2S = GM2 * GM2
      GMXM = GM1 * GM2
      R2P = R2 + 4 * D2
      R4M = R4 - GM2S
      # Polynomial coeffs A, B, C
      # as described in Schneider & Weiss 1986 (eqn 9b)
      A = 16 * D2 * R2 * (R4M - GMXM)
      B = 8 * R * D * (GMXM * R2 - (R2 + 4 * D2) * R4M)
      C = (R2P * R2P) * R4M - GM1S * R4 \
          - 2 * GMXM * R2 * (R2 + 4 * D2)
      C = C + 16 * GM1 * GM2 * D2 * R2
      # Calculate the determinant DT
      DT = B * B - 4 * A * C
      # When the determinant is >= 0 calculate the values of cos(theta) C1, C2
      DTge0 = np.compress(DT >= 0, DT)
      # Modify relevant arrays accordingly
      R_DTgt0 = np.compress(DT >= 0, R)
      R2_DTgt0 = np.compress(DT >= 0, R2)
      B_DTgt0 = np.compress(DT >= 0, B)
      A_DTgt0 = np.compress(DT >= 0, A)
      # Evaluate C1, C2
      C1 = (-B_DTgt0 + np.sqrt(DTge0))/(2 * A_DTgt0)
      C2 = (-B_DTgt0 - np.sqrt(DTge0))/(2 * A_DTgt0)
      # When abs(C1) or abs(C2) are <=1 append point to critical and caustic curves
      # Isolate the indexes of where the absolute values of C1 and C2 are <= 1
      idxC1le1 = ((np.abs(C1) <= 1)).nonzero()
      idxC2le1 = ((np.abs(C2) <= 1)).nonzero()
      # Set up subsamples from relevant arrays
      Rmod2_C1 = R_DTgt0[idxC1le1]
      R2mod2_C1 = R2_DTgt0[idxC1le1]
      Rmod2_C2 = R_DTgt0[idxC2le1]
      R2mod2_C2 = R2_DTgt0[idxC2le1]
      X1, X2 = Rmod2_C1 * C1[idxC1le1], Rmod2_C2 * C2[idxC2le1]
      S1, S2 = np.sqrt(1.0 - C1[idxC1le1] * C1[idxC1le1]), \
               np.sqrt(1.0 - C2[idxC2le1] * C2[idxC2le1])
      Y1, Y2 = Rmod2_C1 * S1, Rmod2_C2 * S2
      X_C1, X_C2  = X1 - D, X2 - D
      Y_C1, Y_C2  = Y1, Y2
      PXCRIT_C1, PYCRIT_C1 = IP * X_C1, IP * Y_C1
      PXCRIT_C2, PYCRIT_C2 = IP * X_C2, IP * Y_C2
      # Append to critical points
      critical_points_x1 = np.append(critical_points_x1, PXCRIT_C1)
      critical_points_x1 = np.append(critical_points_x1, PXCRIT_C2)
      critical_points_x2 = np.append(critical_points_x2, PXCRIT_C1)
      critical_points_x2 = np.append(critical_points_x2, PXCRIT_C2)
      critical_points_y1 = np.append(critical_points_y1, PYCRIT_C1)
      critical_points_y1 = np.append(critical_points_y1, PYCRIT_C2)
      critical_points_y2 = np.append(critical_points_y2, -PYCRIT_C1)
      critical_points_y2 = np.append(critical_points_y2, -PYCRIT_C2)
      # Set up arrays to use for mapping to caustics
      RD2_C1, RD2_C2 = R2mod2_C1 + 4 * D2,  R2mod2_C2 + 4 * D2
      UP1_C1, UP1_C2 = X1 - 2 * D, X2 - 2 * D
      UP2_C1, UP2_C2 = X1, X2
      DN1_C1, DN1_C2 = RD2_C1 - 4 * D * X1, RD2_C2 - 4 * D * X2
      DN2_C1, DN2_C2 = R2mod2_C1, R2mod2_C2
      # Map critical curves to caustics
      XC_C1, XC_C2 = X1 - GM1 * (UP1_C1/DN1_C1) - GM2 * (UP2_C1/DN2_C1), \
                     X2 - GM1 * (UP1_C2/DN1_C2) - GM2 * (UP2_C2/DN2_C2)
      XC_C1, XC_C2 = XC_C1 - D, XC_C2 - D
      YC_C1, YC_C2 = Y1 * (1.0 - GM1/DN1_C1 - GM2/DN2_C1), \
                     Y2 * (1.0 - GM1/DN1_C2 - GM2/DN2_C2)
      PXCAUS_C1, PXCAUS_C2 = IP * XC_C1, IP * XC_C2
      PYCAUS_C1, PYCAUS_C2 = IP * YC_C1, IP * YC_C2

      # Append to caustic points
      caustic_points_x1 = np.append(caustic_points_x1, PXCAUS_C1)
      caustic_points_x1 = np.append(caustic_points_x1, PXCAUS_C2)
      caustic_points_x2 = np.append(caustic_points_x2, PXCAUS_C1)
      caustic_points_x2 = np.append(caustic_points_x2, PXCAUS_C2)
      caustic_points_y1 = np.append(caustic_points_y1, PYCAUS_C1)
      caustic_points_y1 = np.append(caustic_points_y1, PYCAUS_C2)
      caustic_points_y2 = np.append(caustic_points_y2, -PYCAUS_C1)
      caustic_points_y2 = np.append(caustic_points_y2, -PYCAUS_C2)
      # Swap the masses and repeat the calculation
      GM0 = GM1
      GM1 = GM2
      GM2 = GM0
      IP = -IP

   # Evaluate the (linear) trajectory path
   # NXS is the trajectory length (NPN points)
   NXS = NPN
   XLM = 3 # Trajectory from -XLM to +XLM R_E
   XSC = np.linspace(-XLM, XLM, NXS) # Trajectory from -XLM to +XLM R_E
   XSA = XSC
   # Specify the trajectory
   YSC = -cof1 * XSC + cof2
   YSA = YSC
   NT, DT, RC, IT = 1, 0.0, 0.0, 1
   T = IT * DT
   XS = XSC + RC * np.cos(T)
   YS = YSC + RC * np.sin(T)

   # Evaluate the magnification
   # Loop over source positions
   for IXS in range(0,NXS):
      # Calculate positions of images given a source position
      # print("GM1: %s" % GM1)
      # print("GM2: %s" % GM2)
      # print("D: %s" % D)
      # print("XS[IXS]: %s" % XS[IXS])
      # print("YS[IXS]: %s" % YS[IXS])

      imageparms = bin_ima(GM1, GM2, D, XS[IXS], YS[IXS])
      ASA[IXS] = 0.0

      # print imageparms

      XI  = imageparms[:,0]
      YI  = imageparms[:,1]
      AI  = imageparms[:,2]
      IMP = imageparms[:,3]

      # print("XI: %s" % XI)
      # print("YI: %s" % YI)
      # print("AI: %s" % AI)
      # print("IMP: %s" % IMP)

      # transposed_imageparms = np.transpose(imageparms)
      # XI  = transposed_imageparms[0]
      # YI  = transposed_imageparms[1]
      # AI  = transposed_imageparms[2]
      # IMP = transposed_imageparms[3]

      # print imageparms
      # print "--------------------------------"
      # print transposed_imageparms

      # Loop over all images
      for IM in range(0,5):
         AIA[IM,IXS] = AI[IM]
         ASA[IXS] = ASA[IXS] + IMP[IM] * AI[IM]
         # print IMP[IM]
         # print AI[IM]
         X = XI[IM] # Image X location
         Y = YI[IM] # Image Y location

   print( "--- %s seconds (before plot set-up)---" % str(time.time() - start_time))
   print("XSA: %s" % XSA)
   print("ASA: %s" % ASA)

   # Set up drawing canvas
   fig = plt.figure(0, figsize=(6,8), dpi=80)
   ax1 = fig.add_subplot(2,1,1)
   # Plot lensing masses
   ax1.plot(D,0,'ko')
   ax1.plot(-D,0,'ko')
   # Render critical curves and caustics on screen (first plot)
   ax1.plot(critical_points_x1, critical_points_y1, 'r,')
   ax1.plot(critical_points_x2, critical_points_y2, 'r,')
   ax1.plot(caustic_points_x1, caustic_points_y1, 'b,')
   ax1.plot(caustic_points_x2, caustic_points_y2, 'b,')
   # Render trajectory
   ax1.plot(XSA, YSA, 'k-')
   # Annotate
   ax1.text(-2.8, 1.8, r'$M_1$='+"{0:.3f}".format(GM1))
   ax1.text(-2.8, 1.6, r'$M_2$='+"{0:.3f}".format(GM2))
   ax1.text(-2.8, 1.4, r' $d$  ='+"{0:.3f}".format(D))
   ax1.text(-2.8, 1.2, r' $q$  ='+"{0:.3f}".format(min(GM1,GM2)/max(GM1,GM2)) )
   #plt.xlabel(r'$x/R_E$')
   plt.ylabel(r'$y/R_E$')
   # Set axis limits
   plt.axis([-XLM,XLM, -1,2]) # [xmin,xmax, ymin,ymax]
   plt.grid(True)

   # Render lightcurve (second plot, shared x-axis)
   # Plot resulting lightcurve separetely
   ax2 = fig.add_subplot(2,1,2, sharex=ax1)
   # Render magnification plot
   ax2.plot(XSA, ASA,'k-', linewidth=0.5)
   # Set y-scale to log
   # ax2.set_yscale('log')
   # Annotate
   plt.xlabel(r'$x/R_E$')
   plt.ylabel('Magnification')
   # Set axis limits
   plt.xlim([-XLM, XLM])
   plt.grid(True)
   # print( "--- %s seconds ---" % str(time.time() - start_time))
   plt.show()


def main():
   # e: GM1, GM2, D, cof1, cof2 = 0.5, 0.5, 0.5, 0.0, -0.1 # default values
   # GM1, GM2, D, cof1, cof2 = 0.1, 20, 0.5, 0.1, -0.5
   # GM1, GM2, D, cof1, cof2, NPN = 0.2, 20, 0.5, 0.1, -0.5, 4000
   # GM1, GM2, D, cof1, cof2 = 0.2, 20, 0.5, 0.1, -0.5

   # GM1, GM2, D, cof1, cof2, NPN = 0.61383532827548774, 0.3816467172451226, \
   #                                0.5, 0, -0.0304658505511549, 4000

   # GM1, GM2, D, cof1, cof2, NPN = 0.5, 0.9, \
   #                                2.0, 0, -0.0304658505511549, 4000

   # GM1, GM2, D, cof1, cof2, NPN = 0.62, 0.38, \
   #                                0.5, 0, -0.03, 4000

   GM1, GM2, D, cof1, cof2, NPN = 0.62, 0.38, \
                                  0.5, -0.12, -0.03, 4000

   print("GM1: %s" % (GM1))
   print("GM2: %s" % (GM2))
   print("D: %s" % (D))
   print("cof1: %s" % (cof1))
   print("cof2: %s" % (cof2))

   global start_time
   start_time = time.time()
   plot_binary(GM1, GM2, D, cof1, cof2, NPN)

if __name__ == "__main__":
   main()
