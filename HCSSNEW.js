(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

      // Init function for connector, called during every phase
    myConnector.init = function(initCallback) {
        tableau.authType = tableau.authTypeEnum.custom;

              // If we are in the auth phase we only want to show the UI needed for auth
      if (tableau.phase == tableau.phaseEnum.authPhase) {
        $("#getvenuesbutton").css('display', 'none');
      }

      if (tableau.phase == tableau.phaseEnum.gatherDataPhase) {
        // If the API that WDC is using has an endpoint that checks
        // the validity of an access token, that could be used here.
        // Then the WDC can call tableau.abortForAuth if that access token
        // is invalid.
      }
      var body = {
        grant_type: 'client_credentials',
        client_id: 'h0m73swasrlp6fm02r5kn4lmau2aj9or',
        client_secret: 'mJuWO6Da64t0TjwJM4SrxPtwa8MbqZy47PAxZvt3',
        scope: 'e360:read e360:write heavyjob:read heavyjob:write timecards:read timecards:write incidents:read incidents:write meetings:read dis:read dis:write skills:read skills:write users:read users:write'
        //password: credentials.password
    };
    var accessToken;
    var hasAuth;
    $.ajax({
        url: 'https://api.hcssapps.com/identity/connect/token',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded',
        /* data: JSON.stringify(body), /* wrong */
        data: body, /* right */
        complete: function(result) {
            //called when complete
            console.log(result);
        },

        success: function(result) {
            //called when successful
            
            accessToken = result.access_token;
            console.log("Access token is '" + accessToken + "'");
            hasAuth = (accessToken && accessToken.length > 0) || tableau.password.length > 0;
            updateUIWithAuthState(hasAuth);
    
            initCallback();
                          // If we are not in the data gathering phase, we want to store the token
      // This allows us to access the token in the data gathering phase
      if (tableau.phase == tableau.phaseEnum.interactivePhase || tableau.phase == tableau.phaseEnum.authPhase) {
        if (hasAuth) {
            tableau.password = accessToken;

            if (tableau.phase == tableau.phaseEnum.authPhase) {
              // Auto-submit here if we are in the auth phase
              tableau.submit()
            }

            return;
        }
    }

        },

        error: function(result) {
            //called when there is an error
            alert(result);
        },
    });

        //var accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImhiVndaS1ZlSVdiMVhhbUZma01BemhBeEZodyIsImtpZCI6ImhiVndaS1ZlSVdiMVhhbUZma01BemhBeEZodyJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5Lmhjc3NhcHBzLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkuaGNzc2FwcHMuY29tL3Jlc291cmNlcyIsImV4cCI6MTY1OTY0OTMzNywibmJmIjoxNjU5NjQ1NzM3LCJjbGllbnRfaWQiOiJoMG03M3N3YXNybHA2Zm0wMnI1a240bG1hdTJhajlvciIsImh0dHA6Ly9jcmVkZW50aWFscy5oY3NzYXBwcy5jb20vc2NoZW1hcy8yMDE1LzA5L2lkZW50aXR5L2NsYWltcy9jb21wYW55aWQiOiI2OWZlMmFmYi1mMjM0LTQzZDEtYTFiOC0zOWVmY2UzYjZmOTEiLCJyZXF1ZXN0U291cmNlIjoiQ3VzdG9tZXIiLCJzY29wZSI6WyJkaXM6cmVhZCIsImRpczp3cml0ZSIsImUzNjA6cmVhZCIsImUzNjA6d3JpdGUiLCJoZWF2eWpvYjpyZWFkIiwiaGVhdnlqb2I6d3JpdGUiLCJpbmNpZGVudHM6cmVhZCIsImluY2lkZW50czp3cml0ZSIsIm1lZXRpbmdzOnJlYWQiLCJza2lsbHM6cmVhZCIsInNraWxsczp3cml0ZSIsInRpbWVjYXJkczpyZWFkIiwidGltZWNhcmRzOndyaXRlIiwidXNlcnM6cmVhZCIsInVzZXJzOndyaXRlIl19.a46wOor2WMAUmxpzARNogzZHUoXZJCERqSxD7hfVf9v8tel4UVA5K0MTQtgIHx5E0zpNP0rLYXE9qfrkLZk7aYjcY3VV8FtC-exCJt8ZaoDwjnyq76ggF7dME9-vgrQeRxEz6Z5_oYeJ7RyPbY74oZh0K9TSaOO05QoZabBUu0Q6DJ1hYRd-AY-uKQDVBBnmOmOMzwXJasRkC0zoO3IqXqaAsJEkIA1D8AFyPLF0LpGkThTiiG4v9XyJbz9nIynjWzmSiUGwEtxnRpevROEzEAb652_q4AygS3BxvAam0VRhuGYs8VosK-qCVCsvYKjOZl-SJXhlekEoB5XUFVQJdA";



  };

    // This function toggles the label shown depending
  // on whether or not the user has been authenticated
  function updateUIWithAuthState(hasAuth) {
    if (hasAuth) {
        $(".notsignedin").css('display', 'none');
        $(".signedin").css('display', 'block');
    } else {
        $(".notsignedin").css('display', 'block');
        $(".signedin").css('display', 'none');
    }
}

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "id",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "code",
            alias: "Job",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "description",
            //alias: "title",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "status",
            dataType: tableau.dataTypeEnum.string
        }];

        var tableSchema = {
            id: "HCSSJobs",
            alias: "List of Jobs in HeavyJob",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

  // This function actually make the foursquare API call and
  // parses the results and passes them back to Tableau
  myConnector.getData = function(table, doneCallback) {
    var dataToReturn = [];
    var hasMoreData = false;

    var accessToken = tableau.password;
    //var connectionUri = getVenueLikesURI(accessToken);

    var xhr = $.ajax({
        url: 'https://api.hcssapps.com/heavyjob/api/v1/jobs',
        dataType: 'json',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + accessToken
         },
         success: function (data) {
            if (data) {
                var venues = data;

                var ii;
                for (ii = 0; ii < venues.length; ++ii) {
                    var venue = {'id': venues[ii].id,
                                 'code': venues[ii].code,
                                 'description': venues[ii].description,
                                 'status' : venues[ii].status};
                    dataToReturn.push(venue);
                }

                table.appendRows(dataToReturn);
                doneCallback();
            }
            else {
                tableau.abortWithError("No results found");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            // WDC should do more granular error checking here
            // or on the server side.  This is just a sample of new API.
            tableau.abortForAuth("Invalid Access Token");
        }
    });
};

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        
        var accessToken //= "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6ImhiVndaS1ZlSVdiMVhhbUZma01BemhBeEZodyIsImtpZCI6ImhiVndaS1ZlSVdiMVhhbUZma01BemhBeEZodyJ9.eyJpc3MiOiJodHRwczovL2lkZW50aXR5Lmhjc3NhcHBzLmNvbSIsImF1ZCI6Imh0dHBzOi8vaWRlbnRpdHkuaGNzc2FwcHMuY29tL3Jlc291cmNlcyIsImV4cCI6MTY1OTYzNzM1MSwibmJmIjoxNjU5NjMzNzUxLCJjbGllbnRfaWQiOiJoMG03M3N3YXNybHA2Zm0wMnI1a240bG1hdTJhajlvciIsImh0dHA6Ly9jcmVkZW50aWFscy5oY3NzYXBwcy5jb20vc2NoZW1hcy8yMDE1LzA5L2lkZW50aXR5L2NsYWltcy9jb21wYW55aWQiOiI2OWZlMmFmYi1mMjM0LTQzZDEtYTFiOC0zOWVmY2UzYjZmOTEiLCJyZXF1ZXN0U291cmNlIjoiQ3VzdG9tZXIiLCJzY29wZSI6WyJkaXM6cmVhZCIsImRpczp3cml0ZSIsImUzNjA6cmVhZCIsImUzNjA6d3JpdGUiLCJoZWF2eWpvYjpyZWFkIiwiaGVhdnlqb2I6d3JpdGUiLCJpbmNpZGVudHM6cmVhZCIsImluY2lkZW50czp3cml0ZSIsIm1lZXRpbmdzOnJlYWQiLCJza2lsbHM6cmVhZCIsInNraWxsczp3cml0ZSIsInRpbWVjYXJkczpyZWFkIiwidGltZWNhcmRzOndyaXRlIiwidXNlcnM6cmVhZCIsInVzZXJzOndyaXRlIl19.AXT3JGou9-9XxZHS5k0iw6UZ-SArV3_y-cp6bzEgYnNqRkt4_3nsDcyZbZTM5YQHgotQs9HTBSZO9XQdyx4MAjtpCYiloKwCnYxEOWtPk3BUPgATeTYfwmWC9-U6iGVxeTZm_RIOZjd3ruvrKD2n9XH0K5iVObBknxr1_y_whIsQP-oi9L_V0cvCrUB-jFVQEE-TLeNOHeU0VdxfBIm3uOpDqEGHVu2UexkwrLl4V53xdGPN-dToBlQzqUpiGfX0QXzf3Qz8fbTd0qwqLv6iKd_IO-XI89jKvI9XRMH0fuLdIC3SSl9uXVJqe9QVWiWtcAgGjQSboXUaZJ1dbg9idw";
        var hasAuth = accessToken && accessToken.length > 0;
        updateUIWithAuthState(hasAuth);

        $("#submitButton").click(function() {
            tableau.connectionName = "HCSS Jobs"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
