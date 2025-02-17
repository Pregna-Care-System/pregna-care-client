import { useNavigate } from 'react-router-dom'

export default function BlogDetailsPage() {
  const navigate = useNavigate()

  // Hàm quay lại trang trước
  const goBack = () => {
    navigate(-1) // Quay lại trang trước
  }

  // Hàm chuyển tiếp đến một trang khác
  const goForward = () => {
    navigate('/next-article') // Thay đổi đường dẫn trang
  }
  return (
    <div className='bg-gray-50 min-h-screen text-gray-800'>
      <main className='container mx-auto py-8 px-4'>
        <h2 className='text-3xl font-bold text-center  mt-12'>Top 10 Foods Every Pregnant Mom </h2>
        <h2 className='text-3xl font-bold text-center  '>Should Include in Her Diet</h2>
        <p className='text-center text-gray-600 mt-2 flex items-start justify-start'>August 30, 2024</p>

        <div className='mt-6 flex flex-col lg:flex-row gap-8'>
          <div className='lg:w-2/3'>
            <img
              src='src/assets/1-3-Month-pregnancy-diet-chart-preview-1200x675.jpg'
              alt='Healthy salad'
              className='rounded-lg mb-2 w-full lg:h-[500px] object-cover' // Make image bigger
            />
          </div>

          {/* Introduction Section with Custom Styling */}
          <div className='lg:w-1/3'>
            <section>
              <div className='bg-pink-600 text-white rounded-t-lg p-1 flex items-center justify-center'>
                <h5 className='text-1xl'>Introduction</h5>
              </div>
              <p className='mt-4 text-base font-light'>
                <span className='text-4xl font-bold'>P</span>regnancy is a beautiful journey filled with excitement and
                anticipation, but it also comes with the responsibility of ensuring both mother and baby receive the
                best care possible. One of the most important aspects of this journey is maintaining a healthy, balanced
                diet that nourishes the body and supports the baby’s growth. The foods you choose during this time can
                significantly impact your energy levels, immunity, and the baby’s overall development.
              </p>
              <p className='mt-1 text-base font-light'>
                In this article, we dive into the top 10 superfoods every pregnant mom should include in her daily
                meals. From leafy greens rich in folic acid to protein-packed grains and calcium-rich dairy, these foods
                are carefully chosen to provide essential vitamins, minerals, and nutrients.
              </p>
            </section>
          </div>
        </div>

        <div className='mt-3 flex flex-col lg:flex-row gap-8'>
          <div className='lg:w-2/3'>
            <section>
              <p>
                Pregnancy is a time when your body requires additional nutrients to support both your health and your
                baby’s development. A well-balanced diet can help reduce risks of complications, boost energy levels,
                and ensure the baby receives essential nutrients for proper growth.
              </p>
              <h3 className='text-2xl font-semibold mt-3'>1. Top 10 Superfoods for Pregnant Moms</h3>{' '}
              {/* Adjusted margin */}
              <ul className='mt-2 list-disc list-inside space-y-1'>
                {' '}
                {/* Reduced space between list items */}
                <li>
                  <strong>Leafy Greens (Spinach, Kale):</strong> Rich in folic acid, vitamin C, and iron, leafy greens
                  support the development of your baby’s brain and spine while keeping you energized. You can add
                  spinach to smoothies or salads for a nutrient boost.
                </li>
                <li>
                  <strong>Greek Yogurt:</strong> A great source of calcium, which is essential for the development of
                  your baby’s bones and teeth. You can enjoy it with fresh fruit or granola as a snack.
                </li>
                <li>
                  <strong>Eggs:</strong> Packed with protein and choline, eggs promote healthy brain development for the
                  baby. Hard-boil eggs for a quick, portable snack.
                </li>
                <li>
                  <strong>Salmon:</strong> Loaded with omega-3 fatty acids, salmon supports your baby’s brain and eye
                  development. Opt for grilled or baked salmon twice a week.
                </li>
                <li>
                  <strong>Whole Grains (Quinoa, Oats):</strong> These provide fiber, iron, and magnesium to keep your
                  digestion healthy and your energy levels steady. Start your day with a bowl of oatmeal or quinoa
                  porridge.
                </li>
                <li>
                  <strong>Berries (Blueberries, Strawberries):</strong> Rich in antioxidants and vitamins, berries boost
                  your immune system and provide hydration. Add berries to yogurt, smoothies, or as a topping for
                  desserts.
                </li>
                <li>
                  <strong>Nuts and Seeds (Almonds, Chia Seeds):</strong> These are high in healthy fats, protein, and
                  magnesium, which are essential for baby’s development. Carry a small bag of mixed nuts for a healthy
                  snack on-the-go.
                </li>
                <li>
                  <strong>Sweet Potatoes:</strong> High in vitamin A, which helps with the development of your baby’s
                  skin, eyes, and bones. Roast sweet potato wedges as a healthy side dish.
                </li>
                <li>
                  <strong>Beans and Lentils:</strong> Packed with protein and fiber, they are great for managing blood
                  sugar and preventing constipation. Add lentils to soups or stews for a hearty meal.
                </li>
                <li>
                  <strong>Avocados:</strong> Rich in folate, healthy fats, and potassium, avocados help with baby’s
                  brain development and prevent leg cramps for moms. Spread mashed avocado on whole-grain toast for
                  breakfast.
                </li>
              </ul>
            </section>

            <section className='mt-3'>
              <h3 className='text-2xl font-semibold'>2. Tips for Incorporating These Foods</h3>
              <p className='mt-2 text-gray-700'>Tip 1: Plan your meals ahead to ensure variety and balance.</p>
              <p>
                Tip 2: Combine multiple superfoods in one dish, like a quinoa salad with spinach, berries, and nuts.
              </p>
              <p>Tip 3: Consult with your doctor or a nutritionist for personalized dietary advice.</p>
            </section>

            <section>
              <h3 className='text-2xl font-semibold mt-3'>Conclusion</h3>
              <p className='mt-2 text-gray-700'>
                Maintaining a nutritious diet during pregnancy is one of the most important steps you can take for
                yourself and your baby. By incorporating these 10 superfoods into your meals, you’ll not only meet your
                body’s changing nutritional needs but also support the healthy development of your little one. Remember,
                every small effort you make today lays the foundation for a brighter, healthier future. Start with small
                changes, and enjoy this beautiful journey of motherhood!
              </p>
            </section>
          </div>

          <aside className='lg:w-1/3 bg-white shadow-md rounded-lg p-4'>
            <div className='bg-pink-600 text-white rounded-t-lg p-1 flex items-center justify-center'>Keep Reading</div>
            <ul className='mt-4 flex flex-wrap gap-4'>
              <li className='flex items-center space-x-2'>
                <img src='src/assets/tải xuống (5).jpg' alt='' className='w-20 h-19 object-cover rounded' />
                <a href='#' className='text-blue-600 hover:underline'>
                  The Importance of Sleep for Moms and Babies
                </a>
              </li>
              <li className='flex items-center space-x-2'>
                <img
                  src='src/assets/baby-girl-smiling-babyproofing-checklist.jpg'
                  alt=''
                  className='w-20 h-19 object-cover rounded'
                />
                <a href='#' className='text-blue-600 hover:underline'>
                  The Ultimate Guide to Babyproofing Your Home
                </a>
              </li>
              <li className='flex items-center space-x-2'>
                <img src='src/assets/OYH_newborn-holding.jpg' alt='' className='w-20 h-19 object-cover rounded' />
                <a href='#' className='text-blue-600 hover:underline'>
                  Common Newborn Health Issues and How to Handle Them
                </a>
              </li>
            </ul>
          </aside>
        </div>

        <section>
          <div className='text-center'>
            <p className='text-xl font-semibold'>Do you like the article?</p>
          </div>

          <div className='flex justify-center items-center '>
            <button className='text-green-500 text-2xl'>
              <span role='img' aria-label='like'>
                👍
              </span>
            </button>
            <button className='text-red-500 text-2xl'>
              <span role='img' aria-label='dislike'>
                👎
              </span>
            </button>
          </div>

          <div className='flex justify-between'>
            <button onClick={goBack} className='px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300'>
              Go Back
            </button>
            <button onClick={goForward} className='px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700'>
              Next Article
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}
