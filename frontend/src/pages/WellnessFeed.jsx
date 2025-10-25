import React, { useState } from 'react';

const WellnessFeed = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All', icon: '🌟' },
    { id: 'mental', label: 'Mental Health', icon: '🧠' },
    { id: 'physical', label: 'Physical', icon: '💪' },
    { id: 'nutrition', label: 'Nutrition', icon: '🥗' },
    { id: 'sleep', label: 'Sleep', icon: '😴' },
    { id: 'mindfulness', label: 'Mindfulness', icon: '🧘' }
  ];

  const articles = [
    {
      id: 1,
      category: 'mental',
      type: 'tip',
      title: '5-Minute Breathing Exercise for Instant Calm',
      excerpt: 'Learn this simple breathing technique used by Navy SEALs to reduce stress and anxiety in minutes.',
      image: '🧘‍♀️',
      readTime: '3 min read',
      date: '2 hours ago',
      author: 'Dr. Sarah Mitchell',
      tips: [
        'Breathe in for 4 counts',
        'Hold for 4 counts',
        'Breathe out for 4 counts',
        'Hold for 4 counts',
        'Repeat for 5 minutes'
      ]
    },
    {
      id: 2,
      category: 'physical',
      type: 'news',
      title: 'New Study: Walking 7,000 Steps Daily Reduces Mortality Risk',
      excerpt: 'Recent research shows that walking just 7,000 steps per day can significantly reduce health risks, challenging the common 10,000-step goal.',
      image: '👟',
      readTime: '5 min read',
      date: '5 hours ago',
      author: 'Health Research Journal'
    },
    {
      id: 3,
      category: 'nutrition',
      type: 'tip',
      title: 'Mood-Boosting Foods to Add to Your Diet',
      excerpt: 'Discover which foods can naturally enhance your mood and mental clarity.',
      image: '🥑',
      readTime: '4 min read',
      date: '1 day ago',
      author: 'Nutritionist Emma Chen',
      tips: [
        'Fatty fish (omega-3s for brain health)',
        'Dark chocolate (releases endorphins)',
        'Berries (antioxidants reduce stress)',
        'Nuts & seeds (magnesium for calmness)',
        'Fermented foods (gut-brain connection)'
      ]
    },
    {
      id: 4,
      category: 'sleep',
      type: 'advice',
      title: 'The Perfect Evening Routine for Better Sleep',
      excerpt: 'Create a bedtime routine that signals your body it\'s time to wind down.',
      image: '🌙',
      readTime: '6 min read',
      date: '1 day ago',
      author: 'Sleep Specialist Dr. James Park'
    },
    {
      id: 5,
      category: 'mindfulness',
      type: 'tip',
      title: 'Digital Detox: Setting Healthy Tech Boundaries',
      excerpt: 'Practical strategies to reduce screen time and improve mental wellbeing.',
      image: '📱',
      readTime: '4 min read',
      date: '2 days ago',
      author: 'Mindfulness Coach Lisa Wang',
      tips: [
        'No phones 1 hour before bed',
        'Turn off notifications during focus time',
        'Use grayscale mode to reduce appeal',
        'Schedule specific "check-in" times',
        'Replace scrolling with reading or journaling'
      ]
    },
    {
      id: 6,
      category: 'mental',
      type: 'news',
      title: 'Breakthrough: New Therapy Shows 70% Success Rate for Anxiety',
      excerpt: 'Innovative cognitive behavioral therapy technique shows promising results in clinical trials.',
      image: '🔬',
      readTime: '7 min read',
      date: '2 days ago',
      author: 'Medical News Today'
    },
    {
      id: 7,
      category: 'physical',
      type: 'advice',
      title: 'Desk Stretches to Combat Sitting All Day',
      excerpt: 'Simple exercises you can do at your desk to prevent pain and stiffness.',
      image: '🪑',
      readTime: '3 min read',
      date: '3 days ago',
      author: 'Physical Therapist Mike Chen'
    },
    {
      id: 8,
      category: 'nutrition',
      type: 'news',
      title: 'Mediterranean Diet Linked to Longer Lifespan',
      excerpt: 'New 20-year study confirms the long-term benefits of Mediterranean eating patterns.',
      image: '🫒',
      readTime: '5 min read',
      date: '3 days ago',
      author: 'Nutrition Science Journal'
    }
  ];

  const featuredTip = {
    title: 'Daily Wellness Tip',
    content: 'Start your morning with a glass of water before coffee. Your body is dehydrated after sleep, and hydrating first thing boosts energy and metabolism! 💧',
    emoji: '💡'
  };

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const getTypeColor = (type) => {
    switch(type) {
      case 'tip': return '#4CAF50';
      case 'news': return '#2196F3';
      case 'advice': return '#FF9800';
      default: return '#999';
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'tip': return '💡 Quick Tip';
      case 'news': return '📰 News';
      case 'advice': return '🎯 Expert Advice';
      default: return type;
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Wellness Feed</h1>
          <p style={styles.subtitle}>Stay informed with the latest health tips, research, and expert advice</p>
        </div>

        {/* Featured Daily Tip */}
        <div style={styles.featuredTip}>
          <div style={styles.tipEmoji}>{featuredTip.emoji}</div>
          <div>
            <h3 style={styles.tipTitle}>{featuredTip.title}</h3>
            <p style={styles.tipContent}>{featuredTip.content}</p>
          </div>
        </div>

        {/* Category Filters */}
        <div style={styles.categories}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                ...styles.categoryBtn,
                ...(selectedCategory === cat.id ? styles.categoryBtnActive : {})
              }}
            >
              <span style={styles.categoryIcon}>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div style={styles.articlesGrid}>
          {filteredArticles.map(article => (
            <article key={article.id} style={styles.articleCard}>
              <div style={styles.articleImage}>{article.image}</div>
              
              <div style={styles.articleContent}>
                <div style={styles.articleMeta}>
                  <span style={{
                    ...styles.articleType,
                    color: getTypeColor(article.type)
                  }}>
                    {getTypeLabel(article.type)}
                  </span>
                  <span style={styles.articleDate}>{article.date}</span>
                </div>

                <h2 style={styles.articleTitle}>{article.title}</h2>
                <p style={styles.articleExcerpt}>{article.excerpt}</p>

                {article.tips && (
                  <div style={styles.tipsList}>
                    <strong style={styles.tipsTitle}>Key Takeaways:</strong>
                    <ul style={styles.tipsUl}>
                      {article.tips.map((tip, index) => (
                        <li key={index} style={styles.tipItem}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={styles.articleFooter}>
                  <div style={styles.authorInfo}>
                    <span style={styles.authorIcon}>✍️</span>
                    <span style={styles.authorName}>{article.author}</span>
                  </div>
                  <span style={styles.readTime}>⏱️ {article.readTime}</span>
                </div>

                <button style={styles.readMoreBtn}>
                  Read Full Article →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div style={styles.newsletter}>
          <div style={styles.newsletterIcon}>📬</div>
          <div style={styles.newsletterContent}>
            <h3 style={styles.newsletterTitle}>Get Daily Wellness Tips</h3>
            <p style={styles.newsletterDesc}>
              Join 10,000+ people receiving daily wellness insights directly to their inbox
            </p>
            <div style={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Enter your email"
                style={styles.newsletterInput}
              />
              <button style={styles.newsletterBtn}>Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: '#F5F5F7',
    minHeight: '100vh',
    paddingTop: '80px',
    paddingBottom: '40px'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center'
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#2d3748',
    margin: 0,
    marginBottom: '12px'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#666',
    margin: 0
  },
  featuredTip: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '32px',
    borderRadius: '20px',
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginBottom: '32px',
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
  },
  tipEmoji: {
    fontSize: '4rem',
    lineHeight: 1
  },
  tipTitle: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 12px 0'
  },
  tipContent: {
    fontSize: '1.1rem',
    color: 'white',
    margin: 0,
    lineHeight: '1.6'
  },
  categories: {
    display: 'flex',
    gap: '12px',
    marginBottom: '32px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  categoryBtn: {
    background: 'white',
    border: '2px solid #E5E5E7',
    color: '#666',
    padding: '12px 24px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s'
  },
  categoryBtnActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: '2px solid transparent',
    transform: 'scale(1.05)'
  },
  categoryIcon: {
    fontSize: '1.3rem'
  },
  articlesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
    marginBottom: '48px'
  },
  articleCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    flexDirection: 'column'
  },
  articleImage: {
    fontSize: '6rem',
    textAlign: 'center',
    padding: '40px',
    background: 'linear-gradient(135deg, #E0E7FF 0%, #E9D5FF 100%)'
  },
  articleContent: {
    padding: '24px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  articleMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px'
  },
  articleType: {
    fontSize: '0.85rem',
    fontWeight: 'bold'
  },
  articleDate: {
    fontSize: '0.85rem',
    color: '#999'
  },
  articleTitle: {
    fontSize: '1.4rem',
    fontWeight: 'bold',
    color: '#2d3748',
    marginBottom: '12px',
    lineHeight: '1.3'
  },
  articleExcerpt: {
    fontSize: '1rem',
    color: '#666',
    lineHeight: '1.6',
    marginBottom: '16px'
  },
  tipsList: {
    background: '#F8F9FA',
    padding: '16px',
    borderRadius: '12px',
    marginBottom: '16px'
  },
  tipsTitle: {
    fontSize: '0.95rem',
    color: '#2d3748',
    display: 'block',
    marginBottom: '8px'
  },
  tipsUl: {
    margin: 0,
    paddingLeft: '20px'
  },
  tipItem: {
    fontSize: '0.9rem',
    color: '#666',
    marginBottom: '6px',
    lineHeight: '1.5'
  },
  articleFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #E5E5E7'
  },
  authorInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  authorIcon: {
    fontSize: '1.2rem'
  },
  authorName: {
    fontSize: '0.9rem',
    color: '#666',
    fontWeight: '600'
  },
  readTime: {
    fontSize: '0.85rem',
    color: '#999'
  },
  readMoreBtn: {
    background: 'transparent',
    border: '2px solid #667eea',
    color: '#667eea',
    padding: '12px 24px',
    borderRadius: '10px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginTop: 'auto'
  },
  newsletter: {
    background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
    padding: '48px',
    borderRadius: '20px',
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    boxShadow: '0 8px 24px rgba(255, 107, 53, 0.3)'
  },
  newsletterIcon: {
    fontSize: '5rem',
    lineHeight: 1
  },
  newsletterContent: {
    flex: 1
  },
  newsletterTitle: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 12px 0'
  },
  newsletterDesc: {
    fontSize: '1.1rem',
    color: 'white',
    marginBottom: '24px',
    opacity: 0.9
  },
  newsletterForm: {
    display: 'flex',
    gap: '12px'
  },
  newsletterInput: {
    flex: 1,
    padding: '14px 20px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '1rem',
    outline: 'none'
  },
  newsletterBtn: {
    background: 'white',
    color: '#FF6B35',
    border: 'none',
    padding: '14px 32px',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    whiteSpace: 'nowrap'
  }
};

export default WellnessFeed;
