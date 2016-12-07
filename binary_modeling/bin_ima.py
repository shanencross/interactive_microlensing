# Calculate the image positions for the 5th order polynomial
# Solves the binary gravitational lens equation
# Returns an array holding the values for XI, YI (image positions), AI (magnification) and IP (image parity)

# v1.0 - Y. Tsapras 2014

# Import dependencies
import numpy as np
import numpy.polynomial.polynomial as poly

# GM1 = mass of object 1 (as a % of total mass) e.g. 0.1
# GM2 = mass of object 2 (as a % of total mass) e.g  0.9
# D = half binary separation (between components) in Einstein radii
# XS, YS = x,y coordinates of the source (in x/R_E, y/R_E)
def bin_ima(GM1, GM2, D, XS, YS, debug=False, output=False):
   # XI, YI, AI = image coordinates (x,y) and magnification for
   # each of the five (max) images
   #
   # Complex coefficients ZC of the 5th order polynomial
   ZC = np.zeros(6, dtype=complex)
   # Image positions, complex notation
   ZIC = np.zeros(5, dtype=complex)
   # Image parity
   IP = np.zeros(5)
   EP = 1e-02 # 1e-03
   # Set up parameters for the calculation of the coefficients
   HSM = (GM1 + GM2)/2.0     # half sum of masses
   HDM = (GM2 - GM1)/2.0     # half difference of masses
   HSDM = HSM * HDM
   HSSM = HSM * HSM
   HDDM = HDM * HDM
   Z1, Z2 = np.complex(-D, 0.0), np.complex(+D, 0.0)
   Z1C, Z2C = np.complex(-D, 0.0), np.complex(+D, 0.0)
   # Source location in complex notation
   ZS = np.complex(XS, YS)
   AS = np.abs(ZS)
   ZSC = np.complex(XS, -YS)
   ZSS = ZS * ZSC
   # Complex coefficients
   # ----------------------------------------------------------------------------------
   ZC[0] = Z1 * Z1 * (4 * HDDM * ZS + Z1 * (4 * HSDM + 4 * HDM * ZSS + Z1 * \
                     (2 * HSM * ZSC + ZSS * ZSC - Z1 * (2 * HDM + Z1 * ZS) ) ) )
   ZC[1] = -Z1 * (8 * HSDM * ZS + Z1 * (4 * HDDM + 4 * HSSM + 4 * HSM * ZSS + Z1 * \
                 (4 * HDM * ZSC + Z1 * (ZSC * ZSC - Z1 * Z1) ) ) )
   ZC[2] = 4 * HSSM * ZS + Z1 * (4 * HSDM - 4 * HDM * ZSS + Z1 * \
                                (-2 * ZSS * ZSC + Z1 * (4 * HDM + 2 * ZS * Z1 ) ) )
   ZC[3] = 4 * HSM * ZSS + Z1 * (4 * HDM * ZSC + Z1 * (2 * ZSC * ZSC - 2 * Z1 * Z1) )
   ZC[4] = ZSC * (ZSS -2 * HSM) - Z1 * (2 * HDM + ZS * Z1)
   ZC[5] = Z1 * Z1 - ZSC * ZSC
   # ----------------------------------------------------------------------------------
   M = 5                     # Number of possible solutions
   if debug:
     ZI = np.zeros(5)
   else:
     ZI = poly.polyroots(ZC)   # Find roots of the polynomial
     if output:
       print(ZI)
   # print("ZC: {}".format(ZC))
   # print("ZI: {}".format(ZI))
   SA = 0.0
   # Set up an array to hold the values for XI, YI and AI as well as the image parity IP
   result = np.zeros(shape = (5,4))
   XI = ZI.real
   result[:,0] = XI
   YI = ZI.imag
   result[:,1] = YI
   ZR = ZI
   ZP = ZC[0] + ZR * (ZC[1] + ZR * (ZC[2] + ZR * (ZC[3] + \
        ZR * (ZC[4] + ZR * ZC[5]) ) ) )
   ZIC = XI + 1j * -YI
   ZDC1 = ZIC - Z1C
   ZDC2 = ZIC - Z2C
   ZB = GM1/ZDC1 + GM2/ZDC2
   ZE = ZI - ZB
   AE = np.abs(ZE)
   ZD = GM1/(ZDC1 * ZDC1) + GM2/(ZDC2 * ZDC2)
   CJ = np.abs(ZD * ZD)
   VJ = 1.0 - CJ
   AJ = 1.0/VJ
   AI = AJ
   #print ZI,ZP,ZE
   #print CJ,VJ,AJ,SA
   result[:,2] = AI
   SA = SA + AJ
   # Evaluate image parity for all 5 solutions
   for I in range(0,M):
      if output:
         print "AJ[I] < 0:  %s, AJ[I] == 0: %s, AJ[I] > 0: %s" % (AJ[I] < 0, AJ[I] == 0, AJ[I] > 0)
         print "np.abs(ZE[I] - ZS) - EP > 0: %s" % (np.abs(ZE[I] - ZS) - EP > 0)
   
      # case 1
      if (AJ[I] < 0 and not np.abs(ZE[I] - ZS) - EP > 0):
         if output: 
            print("adding -1 to IP");
         IP[I] = -1
     # case 2
      if (AJ[I] == 0 and np.abs(ZE[I] - ZS) - EP > 0):
         if output: 
            print("adding -1 to IP");
         IP[I] = 0
      # case 3
      if (AJ[I] > 0 and not np.abs(ZE[I] - ZS) - EP > 0):
         if output:
            print("adding +1 to IP");
         IP[I] = +1
      result[I,3] = IP[I]
   # print result
   # print
   #print result
   #print "Mangification =", np.sum(result[:,3] * result[:,2])
   return result
