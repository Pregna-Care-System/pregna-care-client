import { getAllFAQCategories } from '@/services/faqService'
import { message } from 'antd'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 60px 24px;
  background: linear-gradient(to bottom, #ffffff, #f7f9fc);
  border-radius: 24px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 60px;
  animation: fadeIn 0.6s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h1 {
    font-size: 32px;
    font-weight: 800;
    color: #1a1a1a;
    margin-bottom: 20px;
    background: linear-gradient(120deg, #8b5cf6, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 18px;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`

const Section = styled.div`
  margin-bottom: 60px;
  animation: slideUp 0.6s ease-out;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 14px;

    svg {
      width: 28px;
      height: 28px;
      color: #8b5cf6;
    }
  }
`

const AccordionItem = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  background: white;
  transition: all 0.3s ease;

  &:hover {
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
    transform: translateY(-2px);
  }
`

const AccordionHeader = styled.button<{ isOpen: boolean }>`
  width: 100%;
  padding: 24px;
  background: ${(props) => (props.isOpen ? '#f8fafc' : 'white')};
  border: none;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
  }

  h3 {
    font-size: 17px;
    font-weight: 600;
    color: #1e293b;
  }

  svg {
    width: 22px;
    height: 22px;
    color: #64748b;
    transform: ${(props) => (props.isOpen ? 'rotate(180deg)' : 'rotate(0)')};
    transition: transform 0.3s ease;
  }
`

const AccordionContent = styled.div<{ isOpen: boolean }>`
  padding: ${(props) => (props.isOpen ? '0 24px 24px' : '0 24px')};
  max-height: ${(props) => (props.isOpen ? '1000px' : '0')};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  overflow: hidden;
  transition: all 0.3s ease;
  p {
    color: #64748b;
    line-height: 1.8;
    font-size: 16px;
  }
`

interface FAQCategory {
  id: string
  name: string
  description: string
  displayOrder: number
  items: FAQ[]
}

interface FAQ {
  id: string
  faqCategoryId: string
  question: string
  answer: string
  displayOrder: string
}



export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})
  const [categories, setCategories] = useState<FAQCategory[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await getAllFAQCategories()
      if (response?.data.success && Array.isArray(response.data.response)) {
        setCategories(response.data.response)
      } else {
        message.error('Failed to fetch FAQ categories')
      }
    } catch (error) {
      message.error('Error fetching data')
    } finally {
      setLoading(false)
    }
  }


  const toggleItem = (question: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [question]: !prev[question]
    }))
  }

  const renderAccordion = (items: FAQ[]) => {
    return items.map((item) => (
      <AccordionItem key={item.id}>
        <AccordionHeader isOpen={openItems[item.question] || false} onClick={() => toggleItem(item.question)}>
          <h3>{item.question}</h3>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
            <path d='M19 9l-7 7-7-7' />
          </svg>
        </AccordionHeader>
        <AccordionContent isOpen={openItems[item.question] || false}>
          <p>{item.answer}</p>
        </AccordionContent>
      </AccordionItem>
    ))
  }

  return (
    <Container>
      <Header>
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about pregnancy tracking and our features.</p>
      </Header>
      {loading ? (
        <p>Loading FAQs...</p>
      ) : (
        categories.map((category) => (
          <Section key={category.id}>
            <h2>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                <circle cx='12' cy='12' r='10' />
                <path d='M12 16v-4M12 8h.01' />
              </svg>
              {category.name}
            </h2>
            {renderAccordion(category.items)}
          </Section>
        ))
      )}
    </Container>
  )
}
