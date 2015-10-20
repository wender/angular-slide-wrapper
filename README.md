
# Angular Slide Wrapper [AngularJS](http://angularjs.org/)
## Turn any list into a slide/carousel
***

I hope this directive can help you to solve your problem, it's a simple solution when you need a Slide/Carousel whithout having to configure tons of things, just take care of your CSS, let this directive solve the problem of making it work well on desktop or mobile.


This directive will look for a list (UL>LI) inside the element 'slide-wrapper' in your html
## Example: 

```HTML
<section class="row">
	<h1>This is an awesome carousel 
    <slide-wrapper>
    	<ul class="slide">
    		<li class="green"><p>Slide 1</p></li>
    		<li class="blue"><p>Slide 2</p></li>
    		<li class="yellow"><p>Slide 3</p></li>
    		<li class="red"><p>Slide 4</p></li>
    	</ul>	
    </slide-wrapper>
</section>
```

Magic!

### Attributes you can use 

	- auto="false" If you don't want it to turn off auto sliding (default true)
	- bullet="false" Don't add bullets (default true)
	- arrows="false" Don't add arrows (default true)

## Demo 
[http://wender.github.io/angular-slide-wrapper/](http://wender.github.io/angular-slide-wrapper/)

Install via Bower
    bower install angular-slide-wrapper --save


