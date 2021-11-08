#! /bin/bash


#(TIMESTAMP=`date +%s`; /usr/bin/time timeout -k 11m 10m lotus client retrieve --miner=f063628 --maxPrice=0.000050000000000000 bafk2bzaceb3tsdxrgb7ewrqtujkgjlfljxqx4avgbotlgbmdkjgkpvhdhtd3y /home/ubuntu/tmp/downloads/f063628-2705902-$TIMESTAMP.jpg 2>&1 | tee /home/ubuntu/tmp/downloads/f063628-2705902-$TIMESTAMP.log); sleep 5

#(TIMESTAMP=`date +%s`; MINER=f022352; /usr/bin/time timeout -k 11m 10m lotus client retrieve --miner=$MINER --maxPrice=0.000050000000000000 Qmd3fis95uGjDb5edj5azAk8tnfWfAxiAAXQq6hDmXzExG /home/ubuntu/tmp/downloads/$MINER-$TIMESTAMP.jpg 2>&1 | tee /home/ubuntu/tmp/downloads/$MINER-$TIMESTAMP.log); sleep 5

#(TIMESTAMP=`date +%s`; MINER=f022352; FILENUM=4; /usr/bin/time timeout -k 11m 10m lotus client retrieve --miner=$MINER --maxPrice=0.000050000000000000 --datamodel-path-selector "Links/$FILENUM/Hash" Qmd3fis95uGjDb5edj5azAk8tnfWfAxiAAXQq6hDmXzExG /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.bin 2>&1 | tee /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.log); sleep 5

#(TIMESTAMP=`date +%s`; MINER=f022352; FILENUM=5; /usr/bin/time timeout -k 11m 10m lotus client retrieve --miner=$MINER --maxPrice=0.000050000000000000 --datamodel-path-selector "Links/$FILENUM/Hash" Qmd3fis95uGjDb5edj5azAk8tnfWfAxiAAXQq6hDmXzExG /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.bin 2>&1 | tee /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.log); sleep 5

#PROVIDERS="f022352 f024944 f063628 f094374 f097720 f0135758 f0157564 f0165375 f0230200 f0458627 f0729674 f0746416 f0752695 f01033119 f01040469"

export CID=QmVhdoCsREoFJGAuXYpdVrr41xecXQDGipKJ5ggViL1fPW
export PROVIDERS="f066596"
export FILENUM=108 # wiki.zip.ac.ab


#export CID=Qmd3fis95uGjDb5edj5azAk8tnfWfAxiAAXQq6hDmXzExG
#export PROVIDERS="f022352 f063628 f094374 f097720 f0135758 f0157564 f0165375 f0230200 f0729674 f0746416"
#export FILENUM=4 # wiki.zip.ac.ab

export TIMESTAMP=`date +%s`
(for p in $PROVIDERS; do
  echo $p
  MINER=$p
  FILENUM=4
  /usr/bin/time timeout -k 11m 10m lotus client retrieve --miner=$MINER \
    --maxPrice=0.000050000000000000 \
    --datamodel-path-selector "Links/$FILENUM/Hash" \
    $CID \
    /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.bin 2>&1 | tee /home/ubuntu/tmp/downloads/$MINER-path-$FILENUM-$TIMESTAMP.log
  sleep 5
done
) 2>&1 | tee -a download-$TIMESTAMP.log
