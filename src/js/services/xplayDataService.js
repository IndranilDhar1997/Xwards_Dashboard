let imagesSizes= [
    {
        name: 'big',
        width: 426,
        height: 460,
        image: null
    },
    {
        name: 'mid',
        width: 426,
        height: 345,
        image: null   
    },
    {
        name: 'thumbnail',
        width: 504,
        height: 282,
        image: null
    }
];

const XplayDataService = {

    getImageSizes: () => {
        return imagesSizes;
    },

    getNonNullImages: () => {
        return imagesSizes.filter(function (image) {
            return (image.image != null)
        });
    },

    saveXplayData: (xplayData) => {
        localStorage.setItem('xplayData', JSON.stringify(xplayData));
    },

    getXplayData: () => {
        var xplayData = JSON.parse(localStorage.getItem('xplayData'));
        return xplayData;
    },

    addImage: (sizename, img) => {
        for (let i in imagesSizes) {
            if (imagesSizes[i].name === sizename) {
                imagesSizes[i].image = img;
            }
        }
    },

    removeXplayData: () => {
        localStorage.removeItem('xplayData');
    }

};

export default XplayDataService;