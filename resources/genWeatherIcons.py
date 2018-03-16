import os
icons = os.listdir("../subModules/Weather_Icons/PNG Files/")
print icons

for icon in icons:
    out = "copy \"..\\subModules\\Weather_Icons\\PNG Files\\\"" + icon + " icons\\weather\\"+icon
    print out
    os.system(out)
    
icons = os.listdir("icons/weather/")
print icons

for icon in icons:
    if icon [:5] != "white":
        out = "\"\\Program Files\\ImageMagick-7.0.7-Q16\\magick.exe\" convert  icons\\weather\\" + icon + " -crop 700x700+150+150 -fill white -opaque black -resize 60x60 icons\\weather\\white" + icon
        print out
        os.system(out)


