import sys,subprocess,os,urllib.request
from PIL import Image
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),'refs')
for c in sys.argv[1:]:
    avif=f'{R}/{c}.avif'
    if not os.path.exists(avif):
        urllib.request.urlretrieve(f'https://assets.arkhamhorror.app/img/arkham/cards/{c}.avif',avif)
    full=f'{R}/{c}-full.png'
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',avif,full],check=True)
    im=Image.open(full).convert('RGB'); w,h=im.size
    # location cards are portrait: art on top ~half
    art=im.crop((int(w*.03),int(h*.09),int(w*.97),int(h*.47)))
    art.thumbnail((1024,1024)); art.save(f'{R}/{c}.png'); os.remove(full)
    print(c,art.size)
