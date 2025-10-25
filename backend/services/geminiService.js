const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp' });
  }

  async generateChatResponse(userMessage, userContext = {}) {
    try {
      const prompt = `You are a supportive wellbeing assistant helping students improve their mental health and personal growth.
      
User Context:
- Name: ${userContext.firstName || 'Student'}
- Level: ${userContext.level || 1}
- Comfort Zone Level: ${userContext.comfortZoneLevel || 5}/10
- Current Streak: ${userContext.streak?.current || 0} days
- Interests: ${userContext.interests?.join(', ') || 'Not specified'}

User Message: ${userMessage}

Respond in a friendly, encouraging, and supportive manner. Keep responses concise (2-3 paragraphs). Offer actionable advice when appropriate.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini chat error:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  async generatePersonalizedChallenge(user, preferences = {}) {
    try {
      const prompt = `Create a personalized wellbeing challenge for a student.

Student Profile:
- Level: ${user.level}
- Comfort Zone Level: ${user.comfortZoneLevel}/10
- Interests: ${user.interests?.join(', ') || 'general wellness'}
- Goals: ${user.wellbeingGoals?.join(', ') || 'personal growth'}
- Preferences: ${JSON.stringify(preferences)}

Generate a JSON object with this structure:
{
  "title": "Challenge title",
  "description": "Detailed description (2-3 sentences)",
  "category": "one of: social, fitness, mindfulness, creativity, learning, adventure",
  "difficulty": "easy/medium/hard based on comfort zone level",
  "pointsReward": "number between 20-100",
  "estimatedDuration": {"value": number, "unit": "minutes/hours/days"},
  "steps": [
    {"order": 1, "instruction": "First step", "tip": "Helpful tip"},
    {"order": 2, "instruction": "Second step", "tip": "Another tip"}
  ],
  "tags": ["tag1", "tag2"]
}

Make it specific, achievable, and tailored to push them slightly beyond their comfort zone.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse challenge JSON');
    } catch (error) {
      console.error('Gemini challenge generation error:', error);
      // Return fallback challenge
      return this.getFallbackChallenge(user);
    }
  }

  async generateMotivationalMessage(user, context = '') {
    try {
      const prompt = `Generate a short, personalized motivational message for a student.

Student Info:
- Name: ${user.firstName}
- Level: ${user.level}
- Points: ${user.totalPoints}
- Current Streak: ${user.streak?.current || 0} days
- Context: ${context}

Create a single inspiring sentence (max 20 words) that's personal and encouraging.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Gemini motivation error:', error);
      return `Keep pushing forward, ${user.firstName}! You're at level ${user.level}! 🌟`;
    }
  }

  async analyzeSuggestions(user, recentProgress) {
    try {
      const completedChallenges = recentProgress.filter(p => p.status === 'completed');
      const categories = completedChallenges.map(p => p.challengeId?.category).filter(Boolean);

      const prompt = `Analyze a student's wellbeing progress and suggest next steps.

Student Profile:
- Level: ${user.level}
- Total Points: ${user.totalPoints}
- Comfort Zone: ${user.comfortZoneLevel}/10
- Streak: ${user.streak?.current} days
- Interests: ${user.interests?.join(', ') || 'general'}
- Recent Challenge Categories: ${categories.join(', ') || 'none'}
- Completed: ${completedChallenges.length} challenges

Generate a JSON array of 3 suggestions with this structure:
[
  {
    "type": "daily/weekly/growth",
    "title": "Suggestion title",
    "description": "Brief description",
    "category": "category name",
    "priority": "high/medium/low"
  }
]

Focus on variety and gradual progression.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse suggestions');
    } catch (error) {
      console.error('Gemini suggestions error:', error);
      return this.getFallbackSuggestions(user);
    }
  }

  async analyzeProgress(user, progress) {
    try {
      const completed = progress.filter(p => p.status === 'completed').length;
      const inProgress = progress.filter(p => p.status === 'in-progress').length;
      const categories = progress.map(p => p.challengeId?.category).filter(Boolean);
      const categoryCount = categories.reduce((acc, cat) => {
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
      }, {});

      const prompt = `Analyze a student's wellbeing journey and provide insights.

Progress Data:
- Completed: ${completed} challenges
- In Progress: ${inProgress} challenges
- Category Distribution: ${JSON.stringify(categoryCount)}
- Current Level: ${user.level}
- Streak: ${user.streak?.current} days

Generate a JSON object:
{
  "summary": "2-3 sentence overview",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "recommendations": ["rec1", "rec2"],
  "projectedLevel": number
}`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse analysis');
    } catch (error) {
      console.error('Gemini analysis error:', error);
      return this.getFallbackAnalysis(user, progress);
    }
  }

  // Fallback methods
  getFallbackChallenge(user) {
    return {
      title: 'Personal Growth Challenge',
      description: 'Take a small step outside your comfort zone today.',
      category: 'personal-growth',
      difficulty: user.level < 5 ? 'easy' : 'medium',
      pointsReward: 50,
      estimatedDuration: { value: 30, unit: 'minutes' },
      steps: [
        { order: 1, instruction: 'Identify something new to try', tip: 'Start small' },
        { order: 2, instruction: 'Take action', tip: 'You can do this!' }
      ],
      tags: ['growth', 'comfort-zone']
    };
  }

  getFallbackSuggestions(user) {
    return [
      {
        type: 'daily',
        title: 'Morning Mindfulness',
        description: 'Start your day with 10 minutes of meditation',
        category: 'mindfulness',
        priority: 'high'
      },
      {
        type: 'weekly',
        title: 'Social Connection',
        description: 'Reach out to 3 new people this week',
        category: 'social',
        priority: 'medium'
      }
    ];
  }

  getFallbackAnalysis(user, progress) {
    const completed = progress.filter(p => p.status === 'completed').length;
    return {
      summary: `You've completed ${completed} challenges. Keep up the great work!`,
      strengths: ['Consistency', 'Dedication'],
      areasForImprovement: ['Try diverse categories'],
      recommendations: ['Focus on completing current challenges'],
      projectedLevel: user.level + Math.floor(completed * 0.5)
    };
  }
}

module.exports = new GeminiService();
