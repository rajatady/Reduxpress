# Introduction


### Why Reduxpress?

When creating API's with ExpressJS, 
more often than not we reach a situation 
where we think that surely there must a 
better way to perform body validations, 
authentication, logging etc. 

```
if (!request.body.name ||
    !request.body.phone ||
    !request.body.dob ||
    !request.body.email) {
    //...
    response.send({
        error: "Data missing"
    });
}
```
A very crude example is illustrated above. The above-mentioned code will always send back the error Data is missing in all the cases. If you want specific missing fields or want to perform type checking on the data, you will have to write a lot of code. Plus the overhead of performing the same kind of validation over and over for every endpoint you create. Surely, all this can be refactored and can be done in a single line of code, right.

Luckily, with reduxpress, it is available. 

```
redux.bodyValidator(request, ["name", "email", "dob", "phone"])
```

That is all. No. Seriously, that is all. Reduxpress validators can perform very advanced validations too by using different types of configurations as the second argument to the validator function.
