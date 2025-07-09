import React, { useState } from 'react';
import { ChevronRight, User, Brain, Clock, Calendar, FileText, TrendingUp, MessageSquare, CheckCircle, BarChart3, Shield, Target, Lightbulb, Users, Phone, Video, Mail, AlertCircle, Star, Zap, ArrowRight, Eye, Sparkles } from 'lucide-react';

const RMJourneyDiagram = () => {
  const [activePhase, setActivePhase] = useState('pre');
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [hoveredAgent, setHoveredAgent] = useState(null);

  const phases = {
    pre: {
      title: 'Pre-Meeting',
      color: 'from-blue-500 to-blue-600',
      lightColor: 'from-blue-50 to-blue-100',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-600',
      icon: <Clock className="w-8 h-8" />,
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
          outputs: 'Client briefing document with key insights and talking points',
          metrics: '85% faster research',
          gradient: 'from-blue-400 to-cyan-500'
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
          outputs: 'Personalized meeting agenda with product recommendations',
          metrics: '70% better preparation',
          gradient: 'from-blue-500 to-indigo-500'
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
          outputs: 'Portfolio health report with actionable insights',
          metrics: '92% accuracy rate',
          gradient: 'from-indigo-500 to-purple-500'
        }
      ]
    },
    during: {
      title: 'In-Meeting',
      color: 'from-green-500 to-emerald-600',
      lightColor: 'from-green-50 to-emerald-100',
      borderColor: 'border-green-500',
      textColor: 'text-green-600',
      icon: <Video className="w-8 h-8" />,
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
          outputs: 'Live insights dashboard and meeting transcript',
          metrics: '3x faster responses',
          gradient: 'from-green-400 to-teal-500'
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
          outputs: 'Customized proposals with optimal pricing structures',
          metrics: '45% win rate increase',
          gradient: 'from-green-500 to-blue-500'
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
          outputs: 'Compliance checklist and risk assessment',
          metrics: '99.9% compliance rate',
          gradient: 'from-emerald-500 to-cyan-500'
        }
      ]
    },
    post: {
      title: 'Post-Meeting',
      color: 'from-purple-500 to-pink-600',
      lightColor: 'from-purple-50 to-pink-100',
      borderColor: 'border-purple-500',
      textColor: 'text-purple-600',
      icon: <Mail className="w-8 h-8" />,
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
          outputs: 'Automated follow-up communications and task lists',
          metrics: '80% faster follow-up',
          gradient: 'from-purple-400 to-pink-500'
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
          outputs: 'Meeting effectiveness report with improvement recommendations',
          metrics: '60% better insights',
          gradient: 'from-purple-500 to-indigo-500'
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
          outputs: 'Relationship health dashboard with strategic recommendations',
          metrics: '35% retention boost',
          gradient: 'from-pink-500 to-rose-500'
        }
      ]
    }
  };

  const PhaseCard = ({ phase, phaseKey, isActive }) => (
    <div
      className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
        isActive 
          ? `bg-gradient-to-br ${phase.color} text-white shadow-2xl scale-105 border-2 border-white` 
          : 'bg-white text-gray-700 hover:shadow-xl shadow-lg border-2 border-gray-100'
      } rounded-2xl p-8 relative overflow-hidden group`}
      onClick={() => setActivePhase(phaseKey)}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${isActive ? 'bg-white bg-opacity-20' : 'bg-gray-100'}`}>
            {phase.icon}
          </div>
          <Sparkles className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'} group-hover:animate-pulse`} />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
        <p className="text-sm opacity-90 mb-4">
          {phase.agents.length} AI Agents Ready
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs opacity-75">Click to explore</span>
          <ArrowRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${isActive ? 'text-white' : 'text-gray-400'}`} />
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-300 transform -skew-x-12"></div>
    </div>
  );

  const AgentCard = ({ agent, isSelected, phaseKey }) => {
    const isHovered = hoveredAgent === agent.id;
    const currentPhase = phases[phaseKey];
    
    return (
      <div
        className={`cursor-pointer transition-all duration-500 transform ${
          isSelected 
            ? 'scale-105 shadow-2xl border-2 border-blue-400' 
            : 'hover:scale-102 hover:shadow-xl shadow-lg border-2 border-gray-100'
        } bg-white rounded-2xl p-6 relative overflow-hidden group`}
        onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
        onMouseEnter={() => setHoveredAgent(agent.id)}
        onMouseLeave={() => setHoveredAgent(null)}
      >
        {/* Animated background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <div className={`bg-gradient-to-br ${agent.gradient} text-white p-3 rounded-xl mr-4 shadow-lg transform group-hover:rotate-3 transition-transform duration-300`}>
              {agent.icon}
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-lg">{agent.name}</h4>
              <div className={`text-sm font-medium ${currentPhase.textColor} flex items-center mt-1`}>
                <Zap className="w-4 h-4 mr-1" />
                {agent.metrics}
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">{agent.description}</p>
          
          {/* Expandable content */}
          <div className={`transition-all duration-500 overflow-hidden ${
            isSelected ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div>
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-blue-500" />
                  Key Capabilities:
                </h5>
                <ul className="space-y-2">
                  {agent.capabilities.map((capability, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600">
                      <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                      {capability}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-green-500" />
                  Output:
                </h5>
                <p className="text-sm text-gray-700">{agent.outputs}</p>
              </div>
            </div>
          </div>
          
          {/* Click indicator */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-xs text-gray-400">
              {isSelected ? 'Click to collapse' : 'Click to expand'}
            </span>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
              isSelected ? 'rotate-90' : ''
            }`} />
          </div>
        </div>
      </div>
    );
  };

  const currentPhase = phases[activePhase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 -left-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute -bottom-20 right-1/4 w-36 h-36 bg-green-200 rounded-full opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-4 shadow-lg">
            <Brain className="w-10 h-10" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            AI-Powered RM Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transforming Commercial Banking through Intelligent Automation
          </p>
        </div>

        {/* Phase Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
        <div className={`bg-gradient-to-br ${currentPhase.lightColor} rounded-3xl p-8 mb-12 shadow-xl border border-white`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {currentPhase.title} AI Agents
            </h2>
            <p className="text-gray-600">Click on any agent to explore its capabilities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPhase.agents.map((agent) => (
              <AgentCard 
                key={agent.id}
                agent={agent}
                isSelected={selectedAgent === agent.id}
                phaseKey={activePhase}
              />
            ))}
          </div>
        </div>

        {/* Journey Flow Visualization */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Complete RM Journey Flow
          </h2>
          
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {Object.entries(phases).map(([key, phase], index) => (
              <React.Fragment key={key}>
                <div className="flex flex-col items-center group cursor-pointer" onClick={() => setActivePhase(key)}>
                  <div className={`bg-gradient-to-br ${phase.color} text-white p-6 rounded-2xl mb-4 shadow-lg transform group-hover:scale-110 transition-all duration-300 ${
                    activePhase === key ? 'ring-4 ring-blue-300 ring-opacity-50' : ''
                  }`}>
                    {phase.icon}
                  </div>
                  <span className="text-lg font-semibold text-gray-700 mb-1">{phase.title}</span>
                  <span className="text-sm text-gray-500">
                    {key === 'pre' && 'Research & Prep'}
                    {key === 'during' && 'Real-time Support'}
                    {key === 'post' && 'Follow-up & Analysis'}
                  </span>
                </div>
                
                {index < Object.entries(phases).length - 1 && (
                  <div className="flex-1 flex items-center justify-center mx-4">
                    <div className="w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 ml-2" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-8 text-center">Transformative Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: TrendingUp, title: 'Increased Efficiency', desc: '60% faster meeting preparation', color: 'from-blue-400 to-cyan-400' },
                { icon: Target, title: 'Better Outcomes', desc: '40% higher conversion rates', color: 'from-green-400 to-emerald-400' },
                { icon: Shield, title: 'Risk Mitigation', desc: '99.9% compliance monitoring', color: 'from-yellow-400 to-orange-400' },
                { icon: Users, title: 'Enhanced Relationships', desc: '35% better client retention', color: 'from-pink-400 to-rose-400' }
              ].map((benefit, idx) => (
                <div key={idx} className="text-center group">
                  <div className={`w-16 h-16 bg-gradient-to-br ${benefit.color} rounded-2xl flex items-center justify-center mx-auto mb-4 transform group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-blue-100 text-sm">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interaction Guide */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-yellow-600 mr-3" />
            <span className="text-gray-700 font-medium">
              💡 Interactive Experience: Click phase cards to switch views • Click agent cards to explore capabilities • Hover for animations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RMJourneyDiagram;