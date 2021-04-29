from PIL import Image
import binascii
import argparse

def rgb2hex(r,g,b):
    return '#{:02x}{:02x}{:02x}'.format(r,g,b)

def hex2rgb(hexcode):
    return tuple(map(ord, hexcode[1:]('hex')))

def str2bin(message):
    binary = bin(int(binascii.hexlify(message.encode()),16))
    # not storing the 0b
    return binary[2:]

def bin2str(binary):
    message = binascii.unhexlify('%x' %(int('0b' + binary, 2)))
    return message

def encode(hexcode, digit):
    if(hexcode[-1] in ('0','1','2','3','4','5')):
        hexcode = hexcode[:-1]+digit
        return hexcode
    else:
        return None

def decode (hexcode):
    if(hexcode[-1] in ('0','1')):
        return hexcode[-1]
    else:
        return None

def hideInfo(filename, message):
    img = Image.open(filename)
    binary = str2bin(message) + '1111111111111110'
    if img.mode in ('RGBA'):
        img = img.convert('RGBA')
        datas = img.getdata()

        newData = []
        digit = 0
        temp = ''
        for item in datas:
            if(digit < len(binary)):
                newPix = encode(rgb2hex(item[0],item[1],item[2]),binary[digit])
                if(newPix == None):
                    newData.append(item)
                else:
                    r, g, b= hex2rgb(newPix)
                    newData.append((r,g,b,255))
                    digit += 1
            else:
                newData.append(item)
        img.putdata(newData)
        img.save(filename, "PNG")
        return "Completed!"
    return "Incorret image mode, couldn't encode"

def decodeInfo (filename):
    img = Image.open(filename)
    binary =''
    if img.mode in ('RGBA'):
        img = img.convert('RGBA')
        datas = img.getdata()

        for item in datas:
            digit = decode(rgb2hex(item[0], item[1], item[2]))
            if digit == None:
                pass
            else:
                binary = binary + digit
                #checking for delimiter.
                if(binary[-16] == '1111111111111110'):
                    print ("Success")
                    return bin2str(binary[:-16])
        return bin2str(binary)
    return "Incorrect image mode, could not decode"


def Main():
    parser = argparse.ArgumentParser(usage ="usage %prog " + '-e/-d <image file>')
    #just to prove it in console
    parser.add_argument('-e', dest='encode', help = 'image file to hide text')
    parser.add_argument('-d', dest='decode', help = 'image file to decode text from')

    (args) = parser.parse_args()

    if(args.encode != None):
        text = input("Enter a message to hide: ")
        #print(str2bin("hola"))
        print (hideInfo(args.encode, text))
    elif (args.decode != None):
        print(decodeInfo(args.decode))
    else:
        print(parser.usage)
        exit(0)

if __name__ == '__main__':
    Main()
    


