import React from "react";
import "./Home.css";
import ingredientsImage from "../assets/ingredients.jpg";
import chefImage from "../assets/chef.jpg";
import timerImage from "../assets/timer.jpg";

const Home = () => {
    return (
        <div className="container mt-4">
            <section className="mb-5">
                <h2 className="text-center mb-4">Our Story</h2>
                <p>
                    We believe in good. We launched Fresh Pan Pizza Best Excuse Awards on our Facebook fan page. Fans were given situations where they had to come up with wacky and fun excuses. The person with the best excuse won the Best Excuse Badge and won Pizzeria's vouchers. Their enthusiastic response proved that Pizzeria's Fresh Pan Pizza is the Tastiest Pan Pizza. Ever!
                </p>
                <p>
                    Ever since we launched the Tastiest Pan Pizza, ever, people have not been able to resist the softest, cheesiest, crunchiest, butteriest Domino's Fresh Pan Pizza. They have been leaving the stage in the middle of a performance and even finding excuses to be disqualified in a football match.
                </p>
                <p>
                    We launched Fresh Pan Pizza Best Excuse Awards on our Facebook fan page. Fans were given situations where they had to come up with wacky and fun excuses. The person with the best excuse won the Best Excuse Badge and won Domino's vouchers. Their enthusiastic response proved that Pizzeria's Fresh Pan Pizza is the Tastiest Pan Pizza. Ever!
                </p>
            </section>

            {/* Ingredients Section */}
            <section className="row align-items-center mb-5">
                <div className="col-md-6">
                    <img
                        src={ingredientsImage}
                        alt="Ingredients"
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6">
                    <h2>Ingredients</h2>
                    <p>
                        We're ruthless about goodness. We have no qualms about tearing up a day-old lettuce leaf (straight from the farm), or steaming a baby (carrot). Cut. Cut. Chop. Chop. Steam. Steam. Stir. Stir. While they're still young and fresh – that's our motto. It makes the kitchen a better place.
                    </p>
                </div>
            </section>

            {/* Chefs Section */}
            <section className="row align-items-center mb-5">
                <div className="col-md-6 order-md-2">
                    <img
                        src={chefImage}
                        alt="Our Chefs"
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6 order-md-1">
                    <h2>Our Chefs</h2>
                    <p>
                        They make sauces sing and salads dance. They create magic with skill, knowledge, passion, and stirring spoons (among other things). They make goodness so good, it doesn't know what to do with itself. We do though. We send it to you.
                    </p>
                </div>
            </section>

            {/* Delivery Section */}
            <section className="row align-items-center mb-5">
                <div className="col-md-6">
                    <img
                        src={timerImage}
                        alt="Ingredients"
                        className="img-fluid rounded shadow"
                    />
                </div>
                <div className="col-md-6">
                    <h2>45 min delivery</h2>
                </div>
            </section>
        </div>
    );
};

export default Home;
