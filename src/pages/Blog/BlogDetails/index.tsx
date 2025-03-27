import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Avatar, Tag } from 'antd'
import {
  ClockCircleOutlined,
  EyeOutlined,
  HeartOutlined,
  HeartFilled,
  ShareAltOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined
} from '@ant-design/icons'
import styled from 'styled-components'
import { FaRegBookmark } from 'react-icons/fa'
import { TbBookmarkFilled } from 'react-icons/tb'

// Styled Components
const PageWrapper = styled.div`
  width: 100%;
  background: #fff1f2; /* Light red background */
  min-height: 100vh;
  margin-top: 70px;
`

const Container = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;

  @media (min-width: 1200px) {
    padding: 24px 40px;
  }
`

const BreadcrumbNav = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  font-size: 14px;
  color: #6b7280;

  a {
    color: #6b7280;
    transition: color 0.2s ease;

    &:hover {
      color: #ef4444;
    }
  }

  .separator {
    color: #d1d5db;
  }
`

const ArticleHeader = styled.div`
  margin-bottom: 32px;
  text-align: center;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;

  .title {
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 16px;
    line-height: 1.2;

    @media (min-width: 768px) {
      font-size: 40px;
    }
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: #6b7280;
    font-size: 14px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .tags {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 24px;
  }
`

const AuthorCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto 32px;
  max-width: 400px;
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  .avatar {
    border: 2px solid white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .info {
    flex: 1;
  }

  .name {
    font-weight: 600;
    color: #111827;
    margin-bottom: 2px;
  }

  .date {
    font-size: 13px;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 4px;
  }
`

const FeaturedImage = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto 40px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    object-fit: cover;
    display: block;
  }
`

const ArticleContent = styled.article`
  color: #374151;
  line-height: 1.8;
  font-size: 17px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin: 40px 0 16px;
    position: relative;
    padding-left: 16px;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 4px;
      background: #ef4444;
      border-radius: 4px;
    }
  }

  h3 {
    font-size: 20px;
    font-weight: 600;
    color: #111827;
    margin: 30px 0 14px;
  }

  p {
    margin-bottom: 20px;
  }

  ul,
  ol {
    margin-bottom: 20px;
    padding-left: 20px;

    li {
      margin-bottom: 8px;
    }
  }

  blockquote {
    border-left: 4px solid #ef4444;
    padding-left: 16px;
    margin: 24px 0;
    font-style: italic;
    color: #4b5563;
  }

  img {
    max-width: 100%;
    border-radius: 8px;
    margin: 24px 0;
  }
`

const ActionBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 40px 0;
  padding: 16px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  .actions {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .action-button {
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    font-size: 14px;
    padding: 8px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: #f3f4f6;
      color: #111827;
    }

    &.active {
      color: #ef4444;
    }
  }
`

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 40px 0;

  .nav-button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: white;
    border: 1px solid #e5e7eb;
    padding: 12px 20px;
    border-radius: 8px;
    font-weight: 500;
    color: #4b5563;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: #ef4444;
      color: #ef4444;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
  }
`

const CommentSection = styled.div`
  margin-top: 60px;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  .header {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 24px;
    color: #111827;
    text-align: center;
  }

  .feedback-question {
    text-align: center;
    margin-bottom: 16px;
    font-weight: 500;
    color: #4b5563;
  }

  .feedback-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 20px;

    button {
      background: white;
      border: 1px solid #e5e7eb;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #ef4444;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      }

      &.active {
        background: #ef4444;
        border-color: #ef4444;
        color: white;
      }
    }
  }
`

export default function BlogDetailsPage() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [feedback, setFeedback] = useState(null)

  // Sample blog data - in a real app, you would fetch this from an API
  const blog = {
    id: '62e16d5b-dbc6-45aa-aa2f-c28ea9fbf76c',
    userId: 'c8bdeb4d-7187-4786-836a-6369c920217c',
    fullName: 'Tien Pham',
    avatarUrl: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1743007856/wqfvbqw0fusea5aokzpx.png',
    tags: [
      {
        id: '43b21580-a7fb-4646-a1e1-787970357b6d',
        name: 'Healthy Eating'
      }
    ],
    pageTitle: 'Top 10 Foods Every Pregnant Mom Should Include in Her Diet',
    heading: 'Top 10 Foods Every Pregnant Mom Should Include in Her Diet',
    content:
      "Pregnancy is a beautiful journey filled with excitement and anticipation, but it also comes with the responsibility of ensuring both mother and baby receive the best care possible. One of the most important aspects of this journey is maintaining a healthy, balanced diet that nourishes the body and supports the baby's growth.",
    shortDescription:
      'Discover the essential foods that provide vital nutrients for both mom and baby during pregnancy.',
    viewCount: 245,
    featuredImageUrl: 'https://res.cloudinary.com/dgzn2ix8w/image/upload/v1742549215/etuobmjcocrgdi07bmhn.png',
    isVisible: true,
    type: 'blog',
    status: 'Approved',
    timeAgo: '22 hours ago'
  }

  // Navigation functions
  const goBack = () => {
    navigate(-1)
  }

  const goForward = () => {
    navigate('/next-article')
  }

  return (
    <PageWrapper>
      <Container>
        <BreadcrumbNav>
          <a href='/'>Home</a>
          <span className='separator'>/</span>
          <a href='/blog'>Blog</a>
          <span className='separator'>/</span>
          <span>{blog.pageTitle}</span>
        </BreadcrumbNav>

        <ArticleHeader>
          <div className='tags'>
            {blog.tags.map((tag) => (
              <Tag key={tag.id} color='error'>
                {tag.name}
              </Tag>
            ))}
          </div>

          <h1 className='title'>{blog.heading}</h1>

          <div className='meta'>
            <span className='views'>
              <EyeOutlined style={{ marginRight: 4 }} />
              {blog.viewCount} views
            </span>
            <span className='time'>
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {blog.timeAgo}
            </span>
          </div>
        </ArticleHeader>

        <AuthorCard>
          <Avatar size={48} src={blog.avatarUrl} className='avatar' style={{ backgroundColor: '#EF4444' }}>
            {blog.fullName
              .split(' ')
              .map((n) => n[0])
              .join('')
              .toUpperCase()}
          </Avatar>
          <div className='info'>
            <div className='name'>{blog.fullName}</div>
            <div className='date'>
              <ClockCircleOutlined />
              {blog.timeAgo}
            </div>
          </div>
        </AuthorCard>

        <FeaturedImage>
          <img src={blog.featuredImageUrl || '/placeholder.svg'} alt={blog.pageTitle} />
        </FeaturedImage>

        <ArticleContent>
          <p>{blog.content}</p>

          <h2>Top 10 Superfoods for Pregnant Moms</h2>
          <ul>
            <li>
              <strong>Leafy Greens (Spinach, Kale):</strong> Rich in folic acid, vitamin C, and iron, leafy greens
              support the development of your baby's brain and spine while keeping you energized. You can add spinach to
              smoothies or salads for a nutrient boost.
            </li>
            <li>
              <strong>Greek Yogurt:</strong> A great source of calcium, which is essential for the development of your
              baby's bones and teeth. You can enjoy it with fresh fruit or granola as a snack.
            </li>
            <li>
              <strong>Eggs:</strong> Packed with protein and choline, eggs promote healthy brain development for the
              baby. Hard-boil eggs for a quick, portable snack.
            </li>
            <li>
              <strong>Salmon:</strong> Loaded with omega-3 fatty acids, salmon supports your baby's brain and eye
              development. Opt for grilled or baked salmon twice a week.
            </li>
            <li>
              <strong>Whole Grains (Quinoa, Oats):</strong> These provide fiber, iron, and magnesium to keep your
              digestion healthy and your energy levels steady. Start your day with a bowl of oatmeal or quinoa porridge.
            </li>
            <li>
              <strong>Berries (Blueberries, Strawberries):</strong> Rich in antioxidants and vitamins, berries boost
              your immune system and provide hydration. Add berries to yogurt, smoothies, or as a topping for desserts.
            </li>
            <li>
              <strong>Nuts and Seeds (Almonds, Chia Seeds):</strong> These are high in healthy fats, protein, and
              magnesium, which are essential for baby's development. Carry a small bag of mixed nuts for a healthy snack
              on-the-go.
            </li>
            <li>
              <strong>Sweet Potatoes:</strong> High in vitamin A, which helps with the development of your baby's skin,
              eyes, and bones. Roast sweet potato wedges as a healthy side dish.
            </li>
            <li>
              <strong>Beans and Lentils:</strong> Packed with protein and fiber, they are great for managing blood sugar
              and preventing constipation. Add lentils to soups or stews for a hearty meal.
            </li>
            <li>
              <strong>Avocados:</strong> Rich in folate, healthy fats, and potassium, avocados help with baby's brain
              development and prevent leg cramps for moms. Spread mashed avocado on whole-grain toast for breakfast.
            </li>
          </ul>

          <h2>Tips for Incorporating These Foods</h2>
          <p>
            Maintaining a nutritious diet during pregnancy doesn't have to be complicated. Here are some practical tips:
          </p>
          <ol>
            <li>Plan your meals ahead to ensure variety and balance.</li>
            <li>Combine multiple superfoods in one dish, like a quinoa salad with spinach, berries, and nuts.</li>
            <li>Keep healthy snacks readily available to avoid reaching for processed foods when hunger strikes.</li>
            <li>Stay hydrated by drinking plenty of water throughout the day.</li>
            <li>Consult with your doctor or a nutritionist for personalized dietary advice.</li>
          </ol>

          <h2>Conclusion</h2>
          <p>
            Maintaining a nutritious diet during pregnancy is one of the most important steps you can take for yourself
            and your baby. By incorporating these 10 superfoods into your meals, you'll not only meet your body's
            changing nutritional needs but also support the healthy development of your little one. Remember, every
            small effort you make today lays the foundation for a brighter, healthier future. Start with small changes,
            and enjoy this beautiful journey of motherhood!
          </p>
        </ArticleContent>

        <ActionBar>
          <div className='actions'>
            <button className={`action-button ${liked ? 'active' : ''}`} onClick={() => setLiked(!liked)}>
              {liked ? <HeartFilled /> : <HeartOutlined />}
              {liked ? 'Liked' : 'Like'}
            </button>
            <button className='action-button'>
              <ShareAltOutlined />
              Share
            </button>
          </div>
          <button className={`action-button ${bookmarked ? 'active' : ''}`} onClick={() => setBookmarked(!bookmarked)}>
            {bookmarked ? <TbBookmarkFilled /> : <FaRegBookmark />}
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        </ActionBar>
      </Container>
    </PageWrapper>
  )
}
