class AutoLearn{
    constructor(aspect){
        this.aspect=aspect;
        this.coefficients=[];
        this.features=[];
        this.featuresNames=[];
    }

    async fetchData(){
        return new Promise((resolve, reject) => {
            const sql='SELECT features, coefficients, featureNames from educational_Data WHERE aspect=?'
        })
    }


    predict(){
        const prediction=0;

        for(let i=0; i<this.coefficients.length; i++){
            prediction+=this.coefficients*this.features
        }
    }
}