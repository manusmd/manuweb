'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Filter, X } from 'lucide-react';
import { Project } from '@/types/project';
import { AnimatedWrapper } from '@/components/animations';

interface ProjectsFilterProps {
  projects: Project[];
  onFilter: (filteredProjects: Project[]) => void;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: Project['category'] | 'all';
  status: Project['status'] | 'all';
  featured: boolean | 'all';
}

export function ProjectsFilter({ projects, onFilter, onFilterChange }: ProjectsFilterProps) {
  const t = useTranslations('projects');

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    status: 'all',
    featured: 'all',
  });

  const categories: (Project['category'] | 'all')[] = [
    'all',
    'frontend',
    'fullstack',
    'mobile',
    'library',
    'tool',
  ];
  const statuses: (Project['status'] | 'all')[] = ['all', 'completed', 'in-progress', 'archived'];

  const applyFilters = (newFilters: FilterState) => {
    let filtered = [...projects];

    // Search filter
    if (newFilters.search.trim()) {
      const searchTerm = newFilters.search.toLowerCase();
      filtered = filtered.filter(
        project =>
          project.title.toLowerCase().includes(searchTerm) ||
          project.description.toLowerCase().includes(searchTerm) ||
          project.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          project.technologies?.some(tech => tech.name.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (newFilters.category !== 'all') {
      filtered = filtered.filter(project => project.category === newFilters.category);
    }

    // Status filter
    if (newFilters.status !== 'all') {
      filtered = filtered.filter(project => project.status === newFilters.status);
    }

    // Featured filter
    if (newFilters.featured !== 'all') {
      filtered = filtered.filter(project => project.featured === newFilters.featured);
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      if ((a.priority || 0) !== (b.priority || 0)) return (a.priority || 0) - (b.priority || 0);
      const aDate = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
      const bDate = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
      return bDate - aDate;
    });

    onFilter(filtered);
    onFilterChange?.(newFilters);
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      category: 'all',
      status: 'all',
      featured: 'all',
    };
    setFilters(clearedFilters);
    applyFilters(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.category !== 'all' ||
    filters.status !== 'all' ||
    filters.featured !== 'all';

  const getCategoryColor = (category: Project['category'] | 'all') => {
    const colors = {
      all: 'text-foreground border-border bg-background',
      frontend: 'text-accent-blue border-accent-blue/30 bg-accent-blue/10',
      fullstack: 'text-accent-violet border-accent-violet/30 bg-accent-violet/10',
      mobile: 'text-accent-green border-accent-green/30 bg-accent-green/10',
      library: 'text-orange-500 border-orange-500/30 bg-orange-500/10',
      tool: 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
    };
    return colors[category] || colors.all;
  };

  return (
    <AnimatedWrapper animation="fadeInUp" delay={0.2}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold">{t('filter.title')}</h3>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
              {t('filter.clear')}
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={t('filter.searchPlaceholder')}
            value={filters.search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              updateFilter('search', e.target.value)
            }
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">{t('filter.category')}</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={filters.category === category ? 'default' : 'outline'}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  filters.category === category
                    ? 'bg-primary text-primary-foreground border-primary'
                    : getCategoryColor(category)
                }`}
                onClick={() => updateFilter('category', category)}
              >
                {t(`categories.${category}`)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">{t('filter.status')}</h4>
          <div className="flex flex-wrap gap-2">
            {statuses.map(status => (
              <Badge
                key={status}
                variant={filters.status === status ? 'default' : 'outline'}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  filters.status === status
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'text-foreground border-border bg-background'
                }`}
                onClick={() => updateFilter('status', status)}
              >
                {t(`status.${status === 'in-progress' ? 'inProgress' : status}`)}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Filter */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">{t('filter.featured')}</h4>
          <div className="flex gap-2">
            <Badge
              variant={filters.featured === 'all' ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => updateFilter('featured', 'all')}
            >
              {t('filter.allProjects')}
            </Badge>
            <Badge
              variant={filters.featured === true ? 'default' : 'outline'}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => updateFilter('featured', true)}
            >
              {t('filter.featuredOnly')}
            </Badge>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
}
