# bin_ima_test.py

from bin_ima import bin_ima
import sys

def main():

  debug = False
  output = False

  # if either of first two args is debug, turn on debug flag,
  # and if either is output, turn on output flag
  if len(sys.argv) > 1:
    if sys.argv[1] == "debug":
      debug = True
    elif sys.argv[1] == "output":
      output = True

  if len(sys.argv) > 2:
    if sys.argv[2] == "debug":
      debug = True
    elif sys.argv[2] == "output":
      output = True

  result = bin_ima(GM1=0.1, GM2=0.9, D=0.5, XS=-3, YS=0.2, debug=debug, output=output)


  if output:
    print(result)

if __name__ == "__main__":
  main();
