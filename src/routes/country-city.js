const { Router } = require("express");
const { Country, City } = require("country-state-city");

const router = Router();

router.get("/countries", (req, res) => {
    try {
        const countriesJson = Country.getAllCountries();
        const countriesList = countriesJson.map(country => {
            return {
                name: country.name,
                idCountry: country.isoCode
            }
        });
        res.status(200).send(countriesList);
    } catch (error) {
        res.status(400).send("No se encuentra lista de paises");
    }
});

router.get("/cities", async (req, res) => {
    const { countryCode } = req.body;
    try {
        const citiesJson = City.getCitiesOfCountry(countryCode);
        const citiesList = citiesJson.map(city => {
            return {
                name: city.name,
                countryCode: city.countryCode,
                latitude: city.latitude,
		        longitude: city.longitude
            }
        });
        res.status(200).send(citiesList);
    } catch (error) {
        res.status(400).send("No se encuentra lista de ciudades");
    }
});

module.exports = router;
