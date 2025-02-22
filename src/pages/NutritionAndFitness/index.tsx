import { useState } from "react";
import { FaLeaf, FaCalculator, FaBook, FaVideo, FaUserMd, FaAppleAlt, FaHeartbeat, FaPersonBooth, FaHeart, FaPlayCircle, FaDumbbell, FaYinYang, FaRunning, FaChevronDown, FaChevronUp, FaPrayingHands } from "react-icons/fa";
import { MdTimer } from "react-icons/md";



interface Recipe {
  name: string;
  image: string;
  nutrients: string[];
  type: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  nutritionalValue: {
    calories: string;
    protein: string;
    iron: string;
    vitaminC: string;
    fiber: string;
    zinc?: string;
  };
}



const NutritionAndFitnessWellness = () => {
  const [activeTab, setActiveTab] = useState("pregnancy");

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);


  const [expandedExercises, setExpandedExercises] = useState(new Array(6).fill(false));

  const exercises = [
    {
      title: "Prenatal Yoga",
      icon: <FaYinYang className="text-3xl" />,
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b",
      duration: "30 mins",
      shortDescription: "Gentle yoga poses to improve flexibility and reduce pregnancy discomfort",
      details: [
        "Start with cat-cow stretches to warm up the spine",
        "Practice modified warrior poses for strength",
        "Include gentle hip opening exercises",
        "End with relaxation and breathing exercises",
        "Avoid poses that put pressure on the abdomen"
      ]
    },
    {
      title: "Low-Impact Cardio",
      icon: <FaRunning className="text-3xl" />,
      image: "https://images.unsplash.com/photo-1518611012118-696072aa579a",
      duration: "20 mins",
      shortDescription: "Safe cardiovascular exercises to maintain fitness during pregnancy",
      details: [
        "Begin with a 5-minute walking warm-up",
        "Incorporate arm circles and leg lifts",
        "Practice stationary marching",
        "Include modified jumping jacks",
        "Cool down with gentle stretches"
      ]
    },
    {
      title: "Strength Training",
      icon: <FaDumbbell className="text-3xl" />,
      image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2",
      duration: "25 mins",
      shortDescription: "Modified strength exercises using body weight and light resistance",
      details: [
        "Perform pregnancy-safe squats",
        "Practice wall push-ups",
        "Do seated resistance band rows",
        "Include pelvic floor exercises",
        "Focus on proper breathing techniques"
      ]
    },
    {
      title: "Pelvic Floor Exercises",
      icon: <FaHeartbeat className="text-3xl" />,
      image: "src/assets/Untitled_design_89_900x500.webp",
      duration: "15 mins",
      shortDescription: "Strengthen pelvic muscles to support pregnancy and labor",
      details: [
        "Kegel exercises for bladder control",
        "Deep core activation",
        "Bridge pose for pelvic stability",
        "Breath coordination with muscle engagement",
        "Stretching to release tension"
      ]
    },

    {
      title: "Side-Lying Leg Workouts",
      icon: <FaPersonBooth className="text-3xl" />,
      image: "src/assets/tải xuống (15).jpg",
      duration: "20 mins",
      shortDescription: "Gentle leg and hip exercises to improve circulation and strength",
      details: [
        "Side leg raises for hip strength",
        "Inner thigh squeezes",
        "Clamshell exercise for glute activation",
        "Ankle circles to reduce swelling",
        "Cool down with gentle stretches"
      ]
    },

    {
      title: "Meditation & Breathing",
      icon: <FaPrayingHands className="text-3xl" />,
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597",
      duration: "15 mins",
      shortDescription: "Mindfulness and breathing exercises for stress relief",
      details: [
        "Deep breathing techniques",
        "Guided meditation practice",
        "Stress relief exercises",
        "Mental preparation for birth",
        "Relaxation visualization"
      ]
    }
  ];

  const toggleExercise = (index: number) => {
    setExpandedExercises(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };


  const nutritionData = {
    pregnancy: [
      {
        trimester: "First Trimester",
        description: "Critical period for fetal development. Focus on folate-rich foods and iron to prevent anemia.",
        nutrients: ["Folic Acid - 600mcg daily", "Iron - 27mg daily", "Calcium - 1000mg daily"],
        foods: ["Leafy greens", "Citrus fruits", "Fortified cereals", "Lean meats"]
      },
      {
        trimester: "Second Trimester",
        description: "Baby's rapid growth phase. Increased need for protein and healthy fats.",
        nutrients: ["Omega-3 - 200-300mg DHA daily", "Protein - 75-100g daily", "Vitamin D - 600IU daily"],
        foods: ["Fatty fish", "Eggs", "Nuts", "Dairy products"]
      },
      {
        trimester: "Third Trimester",
        description: "Final growth spurt. Focus on brain development and energy needs.",
        nutrients: ["DHA - 200mg daily", "Fiber - 25-30g daily", "Zinc - 11mg daily"],
        foods: ["Fish oil", "Whole grains", "Seeds", "Legumes"]
      }
    ],
    children: [
      { age: "0-6 months", needs: ["Breast Milk/Formula", "Vitamin D"] },
      { age: "6-12 months", needs: ["Iron-rich foods", "Soft fruits", "Vegetables"] },
      { age: "1-3 years", needs: ["Whole grains", "Protein", "Dairy"] }
    ]
  };

  const recipes = [
    {
      name: "Pregnancy Power Bowl",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      nutrients: ["Protein", "Iron", "Folate"],
      type: "vegetarian",
      description: "A nutrient-dense bowl perfect for expecting mothers",
      ingredients: ["Quinoa", "Spinach", "Chickpeas", "Sweet potato", "Avocado"],
      instructions: ["Cook quinoa according to package", "Roast sweet potato", "Combine ingredients", "Top with avocado"],
      nutritionalValue: {
        calories: "450",
        protein: "15g",
        iron: "6mg",
        folate: "400mcg"
      }
    },
    {
      name: "Kid's Rainbow Plate",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutrients: ["Vitamins", "Fiber", "Calcium"],
      type: "all",
      description: "Colorful and fun plate that kids will love",
      ingredients: ["Carrots", "Broccoli", "Cherry tomatoes", "Yellow bell pepper", "Greek yogurt dip"],
      instructions: ["Wash and cut vegetables", "Arrange in rainbow pattern", "Serve with yogurt dip"],
      nutritionalValue: {
        calories: "200",
        protein: "8g",
        fiber: "5g",
        calcium: "200mg"
      }
    },
    {
      name: "Morning Wellness Smoothie",
      image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82",
      nutrients: ["Antioxidants", "Vitamin C", "Fiber"],
      type: "vegetarian",
      description: "Perfect for morning sickness relief and energy boost",
      ingredients: ["Ginger", "Banana", "Spinach", "Greek yogurt", "Honey"],
      instructions: ["Blend all ingredients", "Add ice if desired", "Serve immediately"],
      nutritionalValue: {
        calories: "250",
        protein: "10g",
        fiber: "4g",
        vitaminC: "80mg"
      }
    },
    {
      name: "Toddler's Favorite Meatballs",
      image: "https://images.unsplash.com/photo-1529042410759-befb1204b468",
      nutrients: ["Protein", "Iron", "Zinc"],
      type: "meat",
      description: "Healthy and fun protein-packed meatballs kids love",
      ingredients: ["Lean ground turkey", "Quinoa", "Grated vegetables", "Herbs"],
      instructions: ["Mix ingredients", "Form small balls", "Bake until golden"],
      nutritionalValue: {
        calories: "300",
        protein: "20g",
        iron: "4mg",
        zinc: "3mg"
      }
    }
  ];

  return (
    <div>
      <div className="min-h-screen bg-cream-50">
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="src/assets/istockphoto-1363588189-612x612.jpg"
              alt="Mother and child eating healthy food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-sage-600/40"></div>
          </div>
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Nurturing Health Through Nutrition And Fitness</h1>
            <p className="text-xl text-white mb-8">Expert guidance for mothers and children's nutritional wellbeing and Fitness</p>
          </div>
        </section>
        <h2 className="text-3xl font-bold text-center mt-5">Pregnancy-Safe Nutrition</h2>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("pregnancy")}
              className={`bg-gradient-to-r from-[#ff80ab] to-[#ff4081] text-white px-6 py-3 rounded-full transition-all ${activeTab === "pregnancy" ? "bg-sage-500 text-white shadow-lg scale-105" : "bg-sage-100"}`}
            >
              Pregnancy Nutrition
            </button>
            <button
              onClick={() => setActiveTab("children")}
              className={`bg-gradient-to-r from-[#ff80ab] to-[#ff4081] text-white px-6 py-3 rounded-full transition-all ${activeTab === "children" ? "bg-sage-500 text-white shadow-lg scale-105" : "bg-sage-100"}`}
            >
              Child Nutrition
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className={`bg-white rounded-xl p-6 shadow-lg ${activeTab === "pregnancy" ? "border-l-4 border-sage-500" : "border-l-4 border-peach-400"}`}>
              <div className="flex items-center mb-4">
                <FaLeaf className="text-sage-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold">Nutrition Guide</h2>
              </div>
              {activeTab === "pregnancy" ? (
                <div className="space-y-6">
                  {nutritionData.pregnancy.map((item, index) => (
                    <div key={index} className="bg-sage-50 p-4 rounded-lg">
                      <h3 className="font-bold text-xl underline text-sage-700">{item.trimester}</h3>
                      <h5 className="text-gray-600 mt-2">{item.description}</h5>
                      <div className="mt-3">
                        <h4 className="font-medium text-sage-600">Key Nutrients:</h4>
                        <ul className="mt-2 space-y-1 text-left">
                          {item.nutrients.map((nutrient, idx) => (
                            <li key={idx} className="text-gray-600">{nutrient}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <h4 className="font-medium text-sage-600">Recommended Foods:</h4>

                        <ul className="mt-2 flex flex-wrap gap-2">
                          {item.foods.map((food, idx) => (
                            <li key={idx} className="bg-sage-200 px-2 py-1 rounded-full text-sm text-sage-700">{food}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {nutritionData.children.map((item, index) => (
                    <div key={index} className="border-l-4 border-peach-400 pl-4">
                      <h3 className="font-semibold text-lg">{item.age}</h3>
                      <ul className="mt-2">
                        {item.needs.map((need, idx) => (
                          <li key={idx} className="text-gray-600">{need}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <FaAppleAlt className="text-peach-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold">Healthy Recipes</h2>
              </div>
              <div className="space-y-6">
                {recipes.map((recipe, index) => (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-lg cursor-pointer transform transition hover:scale-105"
                    onClick={() => setSelectedRecipe(recipe as unknown as Recipe)}

                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-white font-semibold">{recipe.name}</h3>
                      <p className="text-white/80 text-sm">{recipe.nutrients.join(", ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <FaBook className="text-blue-500 text-2xl mr-3" />
                <h2 className="text-2xl font-bold">Resources</h2>
              </div>
              <div className="space-y-4">
                <button className="w-full bg-blue-50 hover:bg-blue-100 p-4 rounded-lg flex items-center">
                  <FaVideo className="text-blue-500 mr-3" />
                  <span>Watch Nutrition Tutorials</span>
                </button>
                <button className="w-full bg-sage-50 hover:bg-sage-100 p-4 rounded-lg flex items-center">
                  <FaUserMd className="text-sage-500 mr-3" />
                  <span>Expert Tips</span>
                </button>
                <button className="w-full bg-peach-50 hover:bg-peach-100 p-4 rounded-lg flex items-center">
                  <FaCalculator className="text-peach-500 mr-3" />
                  <span>Nutrition Calculator</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{selectedRecipe.name}</h2>
                <button
                  onClick={() => setSelectedRecipe(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <p className="text-gray-600 mb-4">{selectedRecipe.description}</p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Ingredients</h3>
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="w-2 h-2 bg-sage-500 rounded-full mr-2"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Instructions</h3>
                  <ol className="space-y-2">
                    {selectedRecipe.instructions.map((step, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="font-medium mr-2">{idx + 1}.</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Nutritional Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(selectedRecipe.nutritionalValue).map(([key, value]) => (
                      <div key={key} className="bg-sage-50 p-3 rounded-lg text-center">
                        <div className="font-medium text-sage-700 capitalize">{key}</div>
                        <div className="text-sage-900">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>

      <div className="min-h-screen bg-sage-50 ">
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Pregnancy-Safe Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {exercises.map((exercise, index) => (
                <div key={index} className="bg-sage-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                  <div
                    className="cursor-pointer"
                    onClick={() => toggleExercise(index)}
                  >
                    <div className="relative h-48">
                      <img
                        src={exercise.image}
                        alt={exercise.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-white p-2 rounded-full">
                        {exercise.icon}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">{exercise.title}</h3>
                        <span className="flex items-center text-coral-500">
                          {expandedExercises[index] ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </div>
                      <p className="text-gray-600">{exercise.shortDescription}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="flex items-center">
                          <MdTimer className="mr-2" />
                          {exercise.duration}
                        </span>
                        <button className="text-coral-500 hover:text-coral-600">
                          <FaPlayCircle size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${expandedExercises[index] ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="px-6 pb-6 pt-2 border-t border-sage-200">
                      <ul className="space-y-3">
                        {exercise.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="h-6 w-6 rounded-full bg-coral-100 text-coral-500 flex items-center justify-center mr-3 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-full shadow-lg">
          <FaHeart className="text-coral-500 text-2xl animate-pulse" />
        </div>
      </div>

    </div>
  );
};

export default NutritionAndFitnessWellness;