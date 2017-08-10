var	bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
	  mongoose   =require("mongoose"), 
	  express    = require("express"),
	  app        = express();  

mongoose.connect("mongodb://localhost/blogapp"); 
app.set("view engine",  "ejs"); 
app.use(express.static("public")); 
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


var blogSchema= new mongoose.Schema({
    title: String,
    body: String,
    image: String,
    created:  {type: Date, default: Date.now}
}); 

// compaile the schema into model 
var blog = mongoose.model("blog", blogSchema);

// blog.create({
// 	title: "Test test", 
// 	image: "http://yellowicons.com/wp-content/uploads/Gear-Icon-2.png", 
// 	body:"I don't know what this image is so don't ask!!"
// })


app.get("/", function(req, res){
	res.redirect("/blogs")
})
// INDEX ROUTE(Display all)
app.get("/blogs", function(req, res){
	blog.find({}, function(err, blogs){
		if(err){
			console.log(err)
		}else{
			res.render("index", {blogs:blogs}); 
		}
	}); 
})

// NEW ROUTE (Render new page)
app.get("/blogs/new", function(req, res){
	res.render("new"); 
})

// CREATE Route (Create new post and redirect)
app.post("/blogs", function(req, res){
	blog.create(req.body.blog, function(err, newBlog){
		if(err){
			console.log("ERROR")
		}else{
			res.redirect("/blogs");
		}
	})
})

// SHOW Route (Show info about one particular blog)
app.get("/blogs/:id", function(req, res){
	blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs"); 
		}else{
			res.render("show", {blog:foundBlog})
		}
	})
})


// EDIT ROUTE 
app.get("/blogs/:id/edit", function(req, res){
  blog.findById(req.params.id, function(err, foundBlog){
    if(err){
      res.redirect("/"); 
    }else{
      res.render('edit', {blog:foundBlog})
    }
  })

})

// UPDATE ROUTE

app.put("/blogs/:id", function(req, res){
  blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if(err){
      res.redirect("/");
    }else{
      res.redirect("/blogs/"+ req.params.id)
    }
  })
})

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
  blog.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect("/blogs"); 
    }else{
      res.redirect("/blogs"); 
    }

  })
})



app.listen(8000, function(){
	console.log("Listening on port 8000"); 
})
 