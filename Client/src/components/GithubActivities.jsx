import { useState, useEffect } from "react";

export default function GithubActivities() {
  const [activities, setActivities] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pushes: 0,
    prs: 0,
    issues: 0,
    stars: 0,
    forks: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, reposRes] = await Promise.all([
          fetch("https://api.github.com/orgs/Tux-Glug/events"),
          fetch("https://api.github.com/orgs/Tux-Glug/repos?sort=updated&per_page=10"),
        ]);

        if (!eventsRes.ok || !reposRes.ok) {
          throw new Error(`HTTP error! events: ${eventsRes.status}, repos: ${reposRes.status}`);
        }

        const eventsData = await eventsRes.json();
        const reposData = await reposRes.json();

        setActivities(eventsData);
        setRepos(reposData);

        const newStats = {
          total: eventsData.length,
          pushes: eventsData.filter(e => e.type === "PushEvent").length,
          prs: eventsData.filter(e => e.type === "PullRequestEvent").length,
          issues: eventsData.filter(e => e.type === "IssuesEvent").length,
          stars: eventsData.filter(e => e.type === "WatchEvent").length,
          forks: eventsData.filter(e => e.type === "ForkEvent").length,
        };
        setStats(newStats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getTopContributors = () => {
    const contributorMap = {};
    activities.forEach(event => {
      const user = event.actor.login;
      if (!contributorMap[user]) {
        contributorMap[user] = { login: user, avatar_url: event.actor.avatar_url, count: 0 };
      }
      contributorMap[user].count++;
    });
    return Object.values(contributorMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  };

  const getGroupedTimeline = () => {
    const grouped = {};
    activities.forEach(event => {
      const key = `${event.actor.login}-${event.type}-${event.repo.name}`;
      if (!grouped[key]) {
        grouped[key] = {
          id: event.id,
          actor: event.actor,
          type: event.type,
          repo: event.repo.name,
          count: 0,
          created_at: event.created_at,
        };
      }
      grouped[key].count++;
    });
    return Object.values(grouped).sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
  };

  const getEventIcon = (type) => {
    const icons = {
      PushEvent: "📤",
      PullRequestEvent: "🔀",
      IssuesEvent: "🐛",
      WatchEvent: "⭐",
      ForkEvent: "🍴",
      CreateEvent: "✨",
      DeleteEvent: "🗑️",
      ReleaseEvent: "📦",
    };
    return icons[type] || "📌";
  };

  const formatEventText = (event) => {
    const actorLogin = event.actor?.login || event.actor;
    const user = <span className="text-green-400 font-medium">{actorLogin}</span>;
    const repo = <span className="text-gray-400">{event.repo}</span>;
    
    const countText = event.count > 1 ? ` (${event.count} times)` : "";

    switch (event.type) {
      case "PushEvent":
        return (
          <>
            {user} pushed{countText} to {repo}
          </>
        );
      case "PullRequestEvent":
        return (
          <>
            {user} opened{countText} PR in {repo}
          </>
        );
      case "IssuesEvent":
        return (
          <>
            {user} opened{countText} issue in {repo}
          </>
        );
      case "WatchEvent":
        return (
          <>
            {user} starred {repo}
          </>
        );
      case "ForkEvent":
        return (
          <>
            {user} forked {repo}
          </>
        );
      default:
        return (
          <>
            {user} performed {event.type} in {repo}
          </>
        );
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <section className="mt-20">
        <h2 className="text-green-400 mb-10">$ github_activities </h2>
        <p className="text-gray-400">Loading GitHub activity...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-20">
        <h2 className="text-green-400 mb-10">$ github_activities </h2>
        <p className="text-red-400">Error: {error}</p>
        <p className="text-gray-400 text-sm mt-2">Note: GitHub API rate limit (60/hr unauthenticated)</p>
      </section>
    );
  }

  const topContributors = getTopContributors();
  const groupedTimeline = getGroupedTimeline();

  return (
    <section className="mt-20 mb-16">
      <h2 className="text-green-400 mb-10">$ github_activities </h2>

      <div className="mb-10">
        <h3 className="text-gray-300 text-xl mb-4">Top Contributors</h3>
        <div className="flex flex-wrap gap-4">
          {topContributors.map((user, idx) => (
            <div key={user.login} className="flex items-center gap-3 bg-gray-900 px-4 py-3 rounded-lg border border-gray-800">
              <span className="text-gray-500 font-bold text-lg w-5">{idx + 1}</span>
              <img src={user.avatar_url} alt={user.login} className="w-10 h-10 rounded-full" />
              <div>
                <p className="text-green-400 font-medium">{user.login}</p>
                <p className="text-gray-500 text-sm">{user.count} contributions</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h3 className="text-gray-300 text-xl mb-4">Top Repositories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {repos.slice(0, 5).map(repo => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-green-400 transition group"
            >
              <p className="text-green-400 font-medium truncate group-hover:text-green-300">{repo.name}</p>
              <div className="flex gap-3 mt-2 text-gray-500 text-sm">
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h3 className="text-gray-300 text-xl mb-4">Activity Stats</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">Total Events</p>
              <p className="text-2xl text-green-400 font-bold">{stats.total}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">Pushes</p>
              <p className="text-2xl text-green-400 font-bold">{stats.pushes}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">PRs</p>
              <p className="text-2xl text-green-400 font-bold">{stats.prs}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">Issues</p>
              <p className="text-2xl text-green-400 font-bold">{stats.issues}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">Stars</p>
              <p className="text-2xl text-green-400 font-bold">{stats.stars}</p>
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <p className="text-gray-500 text-sm">Forks</p>
              <p className="text-2xl text-green-400 font-bold">{stats.forks}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 mb-16">
          <h3 className="text-gray-300 text-xl mb-4">Recent Activity</h3>
          <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 space-y-0 max-h-80 overflow-y-auto">
            {groupedTimeline.map((event, idx, arr) => (
              <div key={event.id} className="flex items-start group">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-3 h-3 rounded-full bg-green-400 mt-1.5 ring-4 ring-gray-900"></div>
                  {idx !== arr.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-700 group-hover:bg-gray-600 transition"></div>
                  )}
                </div>
                <img src={event.actor.avatar_url} alt="" className="w-6 h-6 rounded-full mr-2 mt-0.5" />
                <div className="flex-1 min-w-0 pb-4">
                  <p className="text-gray-300 text-base">
                    {formatEventText(event)}
                  </p>
                  <p className="text-gray-500 text-sm">{formatDate(event.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
