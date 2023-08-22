const axios = require("axios");
const express = require("express");
const router = express.Router();

// this get api is just for checking the data or in case i have to create frontend then i can use this api from server side or i can put it in frontend

router.get('/api/data', async (req, res) => {
    try {
      const response = await axios.get('https://my-json-server.typicode.com/iranjith4/ad-assignment/db');
      const data = response.data;
      return res.status(200).send({status:true, data:data})
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });


// This API handles data creation with pre-existing validations. The input in the request body must match existing entries in the database fetched from the provided URL. If a combination of facility and options already exists, a message will be logged indicating that the combination already exists. If the combination is not found, it will print "New combination" along with the corresponding facility_id and option_id.

router.post('/createData', async (req, res) => {
    try {
        const body = req.body;

        if (Object.keys(body).length === 0) {
            return res.status(400).send({ status: false, message: "Please enter some data" });
        }
        if (!body.name) {
            return res.status(400).send({ status: false, message: "Please enter Name Of facility" });
        }
        if (!body.optionName) {
            return res.status(400).send({ status: false, message: "Please enter name of Options" });
        }

        const fetchData = async () => {
            try {
                const response = await axios.get("https://my-json-server.typicode.com/iranjith4/ad-assignment/db");
                return response.data;
            } catch (error) {
                console.error("Error fetching data:", error);
                throw error;
            }
        };

        const findMatchingOption = (data, facilityName, optionName) => {
            const facility = data.facilities.find(fac => fac.name === facilityName);
            if (facility) {
                const option = facility.options.find(opt => opt.name === optionName);
                if (option) {
                    return { facility_id: facility.facility_id, options_id: option.id };
                }
            }
            return null;
        };

        const response = await fetchData();
        const optionMatch = findMatchingOption(response,body.name,body.optionName);
      
        if (optionMatch) {
            console.log("Exclusions :", optionMatch);
            const combinationExists = response.exclusions.some(exclusion =>
                exclusion.some(obj =>
                    obj.facility_id === optionMatch.facility_id && obj.options_id === optionMatch.options_id
                )
            );
            const result = combinationExists ? "Combination already exists." : "New combination.";
            console.log(result);
        } else {
            console.log("No match found");
        }

        return res.status(200).send({ status: true, message: "Data processed successfully Check Your console." });

    } catch (error) {
        console.error("Error occurred:", error);
        return res.status(500).send({ status: false, message: error.message });
    }
});

module.exports = router;