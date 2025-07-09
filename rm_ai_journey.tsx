import React, { useState } from 'react';
import { ChevronRight, User, Brain, Clock, Calendar, FileText, TrendingUp, MessageSquare, CheckCircle, BarChart3, Shield, Target, Lightbulb, Users, Phone, Video, Mail, AlertCircle, Star } from 'lucide-react';

const RMJourneyDiagram = () => {
  const [activePhase, setActivePhase] = useState('pre');
  const [selectedAgent, setSelectedAgent] = useState(null);

  const phases = {
    pre: {
      title: 'Pre-Meeting',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100',
      agents: [
        {
          id: 'research',
          name: 'Client Research Agent',
          icon: <TrendingUp className="w-6 h-6" />,
          description: 'Comprehensive client intelligence gathering',
          capabilities: [
            'Financial health analysis from multiple data sources',
            'Market position assessment vs competitors',
            'Recent news and regulatory impact analysis',
            'Credit risk evaluation and trends',
            'Relationship history and touchpoint analysis'
          ],
          outputs: 'Client briefing document with key insights and talking points'
        },
        {
          id: 'preparation',
          name: 'Meeting Prep Agent',
          icon: <Calendar className="w-6 h-6" />,
          description: 'Intelligent meeting preparation and agenda creation',
          capabilities: [
            'Agenda optimization based on client priorities',
            'Product recommendation engine',
            'Risk assessment and compliance checks',
            'Cross-sell/upsell opportunity identification',
            'Regulatory requirement flagging'
          ],
          outputs: 'Personalized meeting agenda with product recommendations'
        },
        {
          id: 'portfolio',
          name: 'Portfolio Analysis Agent',
          icon: <BarChart3 className="w-6 h-6" />,
          description: 'Deep portfolio performance and optimization analysis',
          capabilities: [
            'Portfolio performance benchmarking',
            'Cash flow pattern analysis',
            'Liquidity position assessment',
            'Investment opportunity mapping',
            'Fee optimization recommendations'
          ],
          outputs: 'Portfolio health report with actionable insights'
        }
      ]
    },
    during: {
      title: 'In-Meeting',
      color: 'bg-green-500',
      lightColor: 'bg-green-100',
      agents: [
        {
          id: 'realtime',
          name: 'Real-time Assistant',
          icon: <MessageSquare className="w-6 h-6" />,
          description: 'Live meeting support and information retrieval',
          capabilities: [
            'Real-time fact checking and data retrieval',
            'Instant product information and pricing',
            'Regulatory compliance guidance',
            'Risk calculation and scenario modeling',
            'Meeting transcription and note-taking'
          ],
          outputs: 'Live insights dashboard and meeting transcript'
        },
        {
          id: 'pricing',
          name: 'Dynamic Pricing Agent',
          icon: <Target className="w-6 h-6" />,
          description: 'Intelligent pricing and proposal generation',
          capabilities: [
            'Real-time pricing optimization',
            'Competitive rate analysis',
            'Margin calculation and approval workflows',
            'Terms and conditions customization',
            'Proposal generation with multiple scenarios'
          ],
          outputs: 'Customized proposals with optimal pricing structures'
        },
        {
          id: 'compliance',
          name: 'Compliance Monitor',
          icon: <Shield className="w-6 h-6" />,
          description: 'Continuous compliance and risk monitoring',
          capabilities: [
            'Real-time regulatory compliance checks',
            'KYC/AML screening and alerts',
            'Documentation requirement tracking',
            'Approval workflow management',
            'Audit trail maintenance'
          ],
          outputs: 'Compliance checklist and risk assessment'
        }
      ]
    },
    post: {
      title: 'Post-Meeting',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100',
      agents: [
        {
          id: 'followup',
          name: 'Follow-up Agent',
          icon: <CheckCircle className="w-6 h-6" />,
          description: 'Automated follow-up and task management',
          capabilities: [
            'Action item extraction and assignment',
            'Automated follow-up email generation',
            'Task prioritization and scheduling',
            'Deadline tracking and reminders',
            'Client communication orchestration'
          ],
          outputs: 'Automated follow-up communications and task lists'
        },
        {
          id: 'analytics',
          name: 'Outcome Analytics Agent',
          icon: <Star className="w-6 h-6" />,
          description: 'Meeting effectiveness and outcome analysis',
          capabilities: [
            'Meeting effectiveness scoring',
            'Client sentiment analysis',
            'Conversion probability assessment',
            'Pipeline impact evaluation',
            'Performance benchmarking'
          ],
          outputs: 'Meeting effectiveness report with improvement recommendations'
        },
        {
          id: 'relationship',
          name: 'Relationship Intelligence Agent',
          icon: <Users className="w-6 h-6" />,
          description: 'Relationship health monitoring and optimization',
          capabilities: [
            'Relationship strength assessment',
            'Engagement pattern analysis',
            'Churn risk prediction',
            'Next best action recommendations',
            'Relationship mapping and stakeholder analysis'
          ],
          outputs: 'Relationship health dashboard with strategic recommendations'
        }
      ]
    }
  };

  const PhaseCard = ({ phase, phaseKey, isActive }) => (
    <div
      className={`cursor-pointer transition-all duration-300 ${
        isActive 
          ? `${phase.color} text-white shadow-lg scale-105` 
          : 'bg-white text-gray-700 hover:shadow-md'
      } rounded-lg p-6 border-2 ${isActive ? 'border-transparent' : 'border-gray-200'}`}
      onClick={() => setActivePhase(phaseKey)}
    >
      <h3 className="text-xl font-bold mb-2">{phase.title}</h3>
      <p className="text-sm opacity-90">
        {phase.agents.length} AI Agents
      </p>
      <div className="mt-4 flex justify-center">
        <Brain className="w-8 h-8 opacity-70" />
      </div>
    </div>
  );

  const AgentCard = ({ agent, isSelected }) => (
    <div
      className={`cursor-pointer transition-all duration-300 ${
        isSelected 
          ? 'bg-white shadow-lg scale-105 border-2 border-blue-500' 
          : 'bg-white hover:shadow-md border-2 border-gray-200'
      } rounded-lg p-4`}
      onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
    >
      <div className="flex items-center mb-3">
        <div className={`${phases[activePhase].color} text-white p-2 rounded-lg mr-3`}>
          {agent.icon}
        </div>
        <h4 className="font-semibold text-gray-800">{agent.name}</h4>
      </div>
      <p className="text-sm text-gray-600 mb-3">{agent.description}</p>
      
      {isSelected && (
        <div className="mt-4 space-y-3">
          <div>
            <h5 className="font-medium text-gray-800 mb-2">Key Capabilities:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {agent.capabilities.map((capability, idx) => (
                <li key={idx} className="flex items-start">
                  <ChevronRight className="w-4 h-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                  {capability}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-t pt-3">
            <h5 className="font-medium text-gray-800 mb-2">Output:</h5>
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {agent.outputs}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const currentPhase = phases[activePhase];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          AI-Powered Relationship Manager Journey
        </h1>
        <p className="text-lg text-gray-600">
          Transforming Commercial Banking through Intelligent Automation
        </p>
      </div>

      {/* Phase Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {Object.entries(phases).map(([key, phase]) => (
          <PhaseCard 
            key={key} 
            phase={phase} 
            phaseKey={key} 
            isActive={activePhase === key} 
          />
        ))}
      </div>

      {/* Active Phase Details */}
      <div className={`${currentPhase.lightColor} rounded-xl p-6 mb-8`}>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {currentPhase.title} AI Agents
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPhase.agents.map((agent) => (
            <AgentCard 
              key={agent.id}
              agent={agent}
              isSelected={selectedAgent === agent.id}
            />
          ))}
        </div>
      </div>

      {/* Journey Flow Visualization */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Complete RM Journey Flow
        </h2>
        
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-blue-500 text-white p-4 rounded-full mb-2">
              <Clock className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium text-gray-700">Pre-Meeting</span>
            <span className="text-xs text-gray-500 mt-1">Research & Prep</span>
          </div>
          
          <ChevronRight className="w-8 h-8 text-gray-400" />
          
          <div className="flex flex-col items-center">
            <div className="bg-green-500 text-white p-4 rounded-full mb-2">
              <Video className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium text-gray-700">In-Meeting</span>
            <span className="text-xs text-gray-500 mt-1">Real-time Support</span>
          </div>
          
          <ChevronRight className="w-8 h-8 text-gray-400" />
          
          <div className="flex flex-col items-center">
            <div className="bg-purple-500 text-white p-4 rounded-full mb-2">
              <Mail className="w-8 h-8" />
            </div>
            <span className="text-sm font-medium text-gray-700">Post-Meeting</span>
            <span className="text-xs text-gray-500 mt-1">Follow-up & Analysis</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold">Increased Efficiency</h3>
            <p className="text-sm opacity-90">60% faster meeting preparation</p>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold">Better Outcomes</h3>
            <p className="text-sm opacity-90">40% higher conversion rates</p>
          </div>
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold">Risk Mitigation</h3>
            <p className="text-sm opacity-90">Real-time compliance monitoring</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold">Enhanced Relationships</h3>
            <p className="text-sm opacity-90">Deeper client insights</p>
          </div>
        </div>
      </div>

      {/* Interaction Instructions */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center">
          <Lightbulb className="w-5 h-5 text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-800">
            Click on phase cards to explore different stages, and click on agent cards to see detailed capabilities!
          </span>
        </div>
      </div>
    </div>
  );
};

export default RMJourneyDiagram;